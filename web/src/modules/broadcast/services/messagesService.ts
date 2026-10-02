import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type QueryConstraint,
} from 'firebase/firestore'

import { COLLECTIONS } from '@lib/collections'
import { db } from '@lib/firebase'
import { createReadConverter, fromQuery, toDate } from '@lib/firestore'

import type { MessageInput } from '../schemas/messageSchema'
import type { Message, MessageFilter } from '../types'
import { buildMessagePayload } from '../utils/buildMessagePayload'

const messages = collection(db, COLLECTIONS.messages)

const messageConverter = createReadConverter<Message>((id, data) => ({
  id,
  connectionId: data.connectionId,
  contactIds: data.contactIds ?? [],
  content: data.content,
  status: data.status,
  scheduledAt: toDate(data.scheduledAt),
  sentAt: toDate(data.sentAt),
  createdAt: toDate(data.createdAt),
}))

export function observeMessages(clientId: string, connectionId: string, filter: MessageFilter) {
  const statusFilter: QueryConstraint[] = filter === 'all' ? [] : [where('status', '==', filter)]

  return fromQuery(
    query(
      messages.withConverter(messageConverter),
      where('clientId', '==', clientId),
      where('connectionId', '==', connectionId),
      ...statusFilter,
      orderBy('createdAt', 'desc'),
    ),
  )
}

export const createMessage = (clientId: string, connectionId: string, input: MessageInput) =>
  addDoc(messages, {
    clientId,
    connectionId,
    ...buildMessagePayload(input),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

export const updateMessage = (messageId: string, input: MessageInput) =>
  updateDoc(doc(messages, messageId), {
    ...buildMessagePayload(input),
    updatedAt: serverTimestamp(),
  })

export const deleteMessage = (messageId: string) => deleteDoc(doc(messages, messageId))
