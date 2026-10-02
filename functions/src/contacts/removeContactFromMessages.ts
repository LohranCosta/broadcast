import {
  FieldValue,
  type DocumentReference,
  type Firestore,
  type QueryDocumentSnapshot,
} from 'firebase-admin/firestore'
import * as logger from 'firebase-functions/logger'

import { COLLECTIONS, MESSAGE_STATUS, PAGE_SIZE } from '../config'
import { countOf } from '../lib/count'
import { describeError, mapPages, readStrings } from '../lib/firestore'

export type ContactOwner = { contactId: string; clientId: string }

export type RemovalSummary = { updated: number; deleted: number; failed: number }

type RemovalOutcome = 'updated' | 'deleted' | 'unchanged' | 'failed'

const findMessagesWithContact = (db: Firestore, { contactId, clientId }: ContactOwner) =>
  db
    .collection(COLLECTIONS.messages)
    .where('clientId', '==', clientId)
    .where('contactIds', 'array-contains', contactId)

const detachContact = (db: Firestore, message: DocumentReference, contactId: string) =>
  db.runTransaction(async (transaction): Promise<RemovalOutcome> => {
    const snapshot = await transaction.get(message)
    const contactIds = readStrings(snapshot, 'contactIds')

    if (!contactIds.includes(contactId)) return 'unchanged'

    const isScheduled = snapshot.get('status') === MESSAGE_STATUS.scheduled
    const hasOtherRecipients = contactIds.some((id) => id !== contactId)

    if (isScheduled && !hasOtherRecipients) {
      transaction.delete(message)
      return 'deleted'
    }

    transaction.update(message, {
      contactIds: FieldValue.arrayRemove(contactId),
      updatedAt: FieldValue.serverTimestamp(),
    })
    return 'updated'
  })

const detachContactSafely = (db: Firestore, message: QueryDocumentSnapshot, contactId: string) =>
  detachContact(db, message.ref, contactId).catch((error: unknown): RemovalOutcome => {
    logger.error('Falha ao remover contato da mensagem', {
      path: message.ref.path,
      contactId,
      ...describeError(error),
    })
    return 'failed'
  })

const summarize = (outcomes: RemovalOutcome[]): RemovalSummary => ({
  updated: countOf(outcomes, 'updated'),
  deleted: countOf(outcomes, 'deleted'),
  failed: countOf(outcomes, 'failed'),
})

export const removeContactFromMessages = async (
  db: Firestore,
  contact: ContactOwner,
  pageSize = PAGE_SIZE,
) =>
  summarize(
    await mapPages(findMessagesWithContact(db, contact), pageSize, (messages) =>
      Promise.all(messages.map((message) => detachContactSafely(db, message, contact.contactId))),
    ),
  )
