import {
  FieldValue,
  Timestamp,
  type BulkWriter,
  type Firestore,
  type QueryDocumentSnapshot,
} from 'firebase-admin/firestore'

import { COLLECTIONS, MESSAGE_STATUS, PAGE_SIZE } from '../config'
import { countOf } from '../lib/count'
import { mapPages, withBulkWriter, writeEach } from '../lib/firestore'

export type DispatchSummary = { sent: number; skipped: number }

const findDueMessages = (db: Firestore, now: Date) =>
  db
    .collection(COLLECTIONS.messages)
    .where('status', '==', MESSAGE_STATUS.scheduled)
    .where('scheduledAt', '<=', Timestamp.fromDate(now))
    .orderBy('scheduledAt')

const markAsSent = (writer: BulkWriter, message: QueryDocumentSnapshot) =>
  writer.update(
    message.ref,
    {
      status: MESSAGE_STATUS.sent,
      sentAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { lastUpdateTime: message.updateTime },
  )

const summarize = (outcomes: boolean[]): DispatchSummary => ({
  sent: countOf(outcomes, true),
  skipped: countOf(outcomes, false),
})

export const markMessagesAsSent = async (writer: BulkWriter, messages: QueryDocumentSnapshot[]) =>
  summarize(await writeEach(writer, messages, markAsSent))

export const dispatchDueMessages = (db: Firestore, now: Date, pageSize = PAGE_SIZE) =>
  withBulkWriter(db, async (writer) =>
    summarize(
      await mapPages(findDueMessages(db, now), pageSize, (messages) =>
        writeEach(writer, messages, markAsSent),
      ),
    ),
  )
