import type { DocumentReference } from 'firebase-admin/firestore'
import { afterEach, describe, expect, it } from 'vitest'

import { COLLECTIONS, MESSAGE_STATUS } from '../config'
import { contactData, createSeeder, db, messageData, uniqueId } from '../testing/firestore'
import { deleteConnectionData } from './deleteConnectionData'

describe('deleteConnectionData', () => {
  const { seed, cleanup } = createSeeder()
  const clientId = uniqueId('client')
  const otherClientId = uniqueId('client')
  const connectionId = uniqueId('connection')
  const otherConnectionId = uniqueId('connection')

  const existing = (references: DocumentReference[]) =>
    Promise.all(references.map(async (reference) => (await reference.get()).exists))

  afterEach(cleanup)

  it('apaga contatos e mensagens só da conexão e do cliente informados', async () => {
    const connectionData = await Promise.all([
      seed(COLLECTIONS.contacts, contactData(clientId, connectionId)),
      seed(COLLECTIONS.contacts, contactData(clientId, connectionId)),
      seed(COLLECTIONS.messages, messageData(clientId, connectionId)),
      seed(
        COLLECTIONS.messages,
        messageData(clientId, connectionId, { status: MESSAGE_STATUS.sent }),
      ),
    ])
    const otherData = await Promise.all([
      seed(COLLECTIONS.contacts, contactData(clientId, otherConnectionId)),
      seed(COLLECTIONS.contacts, contactData(otherClientId, connectionId)),
      seed(COLLECTIONS.messages, messageData(clientId, otherConnectionId)),
      seed(COLLECTIONS.messages, messageData(otherClientId, connectionId)),
    ])

    await expect(deleteConnectionData(db, { connectionId, clientId })).resolves.toEqual({
      messages: 2,
      contacts: 2,
      failed: 0,
    })
    await expect(existing(connectionData)).resolves.toEqual([false, false, false, false])
    await expect(existing(otherData)).resolves.toEqual([true, true, true, true])
  })

  it('percorre todas as páginas de contatos e mensagens', async () => {
    const connectionData = await Promise.all([
      ...Array.from({ length: 3 }, () =>
        seed(COLLECTIONS.contacts, contactData(clientId, connectionId)),
      ),
      ...Array.from({ length: 4 }, () =>
        seed(COLLECTIONS.messages, messageData(clientId, connectionId)),
      ),
    ])

    await expect(deleteConnectionData(db, { connectionId, clientId }, 2)).resolves.toEqual({
      messages: 4,
      contacts: 3,
      failed: 0,
    })
    await expect(existing(connectionData)).resolves.toEqual(connectionData.map(() => false))
  })

  it('não apaga nada quando a conexão não tem dados', async () => {
    const otherData = await seed(COLLECTIONS.contacts, contactData(clientId, otherConnectionId))

    await expect(deleteConnectionData(db, { connectionId, clientId })).resolves.toEqual({
      messages: 0,
      contacts: 0,
      failed: 0,
    })
    await expect(existing([otherData])).resolves.toEqual([true])
  })
})
