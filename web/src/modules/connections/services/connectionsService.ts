import { addDoc, collection, orderBy, query, serverTimestamp, where } from 'firebase/firestore'

import { COLLECTIONS } from '@lib/collections'
import { db } from '@lib/firebase'
import { createReadConverter, fromQuery, toDate } from '@lib/firestore'

import type { ConnectionInput } from '../schemas/connectionSchema'
import type { Connection } from '../types'

const connections = collection(db, COLLECTIONS.connections)

const connectionConverter = createReadConverter<Connection>((id, data) => ({
  id,
  name: data.name,
  createdAt: toDate(data.createdAt),
  updatedAt: toDate(data.updatedAt),
}))

export const observeConnections = (clientId: string) =>
  fromQuery(
    query(
      connections.withConverter(connectionConverter),
      where('clientId', '==', clientId),
      orderBy('createdAt', 'desc'),
    ),
  )

export const createConnection = (clientId: string, { name }: ConnectionInput) =>
  addDoc(connections, {
    clientId,
    name,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
