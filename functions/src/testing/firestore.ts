import { randomUUID } from 'node:crypto'

import { getApps, initializeApp } from 'firebase-admin/app'
import {
  FieldPath,
  getFirestore,
  Timestamp,
  type DocumentData,
  type DocumentReference,
} from 'firebase-admin/firestore'

import { MESSAGE_STATUS } from '../config'

const TEST_PROJECT = 'demo-broadcast'
const TEST_DATABASE = 'functions-tests'

if (!process.env.FIRESTORE_EMULATOR_HOST) {
  throw new Error('Os testes precisam do emulador do Firestore: rode "npm test".')
}

export const db = getFirestore(
  getApps().at(0) ?? initializeApp({ projectId: TEST_PROJECT }),
  TEST_DATABASE,
)

export const uniqueId = (prefix: string) => `${prefix}-${randomUUID()}`

export const minutesFrom = (date: Date, minutes: number) =>
  Timestamp.fromMillis(date.getTime() + minutes * 60_000)

export const queryDocument = async (reference: DocumentReference) => {
  const { docs } = await reference.parent.where(FieldPath.documentId(), '==', reference.id).get()
  return docs[0]
}

export const createSeeder = () => {
  const created: DocumentReference[] = []

  const seed = async (collection: string, data: DocumentData) => {
    const reference = db.collection(collection).doc(uniqueId(collection))
    await reference.set(data)
    created.push(reference)
    return reference
  }

  const cleanup = async () => {
    await Promise.all(created.splice(0).map((reference) => reference.delete()))
  }

  return { seed, cleanup }
}

const createdLongAgo = Timestamp.fromDate(new Date('2026-01-01T12:00:00Z'))

export const contactData = (clientId: string, connectionId: string) => ({
  clientId,
  connectionId,
  name: 'Contato de teste',
  phone: '11999999999',
  createdAt: createdLongAgo,
  updatedAt: createdLongAgo,
})

export const messageData = (
  clientId: string,
  connectionId: string,
  overrides: DocumentData = {},
) => ({
  clientId,
  connectionId,
  contactIds: [],
  content: 'Mensagem de teste',
  status: MESSAGE_STATUS.scheduled,
  scheduledAt: null,
  sentAt: null,
  createdAt: createdLongAgo,
  updatedAt: createdLongAgo,
  ...overrides,
})
