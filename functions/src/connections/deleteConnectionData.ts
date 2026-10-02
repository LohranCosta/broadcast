import type { BulkWriter, Firestore, Query, QueryDocumentSnapshot } from 'firebase-admin/firestore'

import { COLLECTIONS, PAGE_SIZE } from '../config'
import { countOf } from '../lib/count'
import { mapPages, withBulkWriter, writeEach } from '../lib/firestore'

export type ConnectionOwner = { connectionId: string; clientId: string }

export type DeletionSummary = { messages: number; contacts: number; failed: number }

type ConnectionCollection = typeof COLLECTIONS.messages | typeof COLLECTIONS.contacts

const findConnectionData = (
  db: Firestore,
  collection: ConnectionCollection,
  { connectionId, clientId }: ConnectionOwner,
) =>
  db
    .collection(collection)
    .where('clientId', '==', clientId)
    .where('connectionId', '==', connectionId)

const deleteDocument = (writer: BulkWriter, document: QueryDocumentSnapshot) =>
  writer.delete(document.ref)

const deleteAll = (writer: BulkWriter, query: Query, pageSize: number) =>
  mapPages(query, pageSize, (documents) => writeEach(writer, documents, deleteDocument))

export const deleteConnectionData = (
  db: Firestore,
  connection: ConnectionOwner,
  pageSize = PAGE_SIZE,
) =>
  withBulkWriter(db, async (writer): Promise<DeletionSummary> => {
    const messages = await deleteAll(
      writer,
      findConnectionData(db, COLLECTIONS.messages, connection),
      pageSize,
    )
    const contacts = await deleteAll(
      writer,
      findConnectionData(db, COLLECTIONS.contacts, connection),
      pageSize,
    )

    return {
      messages: countOf(messages, true),
      contacts: countOf(contacts, true),
      failed: countOf([...messages, ...contacts], false),
    }
  })
