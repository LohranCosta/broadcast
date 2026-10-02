import { Timestamp, type DocumentData } from 'firebase-admin/firestore'
import { afterEach, describe, expect, it } from 'vitest'

import { COLLECTIONS, MESSAGE_STATUS } from '../config'
import { createSeeder, db, messageData, uniqueId } from '../testing/firestore'
import { removeContactFromMessages } from './removeContactFromMessages'

describe('removeContactFromMessages', () => {
  const { seed, cleanup } = createSeeder()
  const clientId = uniqueId('client')
  const otherClientId = uniqueId('client')
  const connectionId = uniqueId('connection')
  const contactId = uniqueId('contact')
  const otherContactId = uniqueId('contact')

  const seedMessage = (overrides: DocumentData, owner = clientId) =>
    seed(COLLECTIONS.messages, messageData(owner, connectionId, overrides))

  afterEach(cleanup)

  it('remove o contato das mensagens do cliente e apaga as agendadas sem contatos', async () => {
    const shared = await seedMessage({ contactIds: [contactId, otherContactId] })
    const sent = await seedMessage({
      contactIds: [contactId],
      status: MESSAGE_STATUS.sent,
      sentAt: Timestamp.now(),
    })
    const exclusive = await seedMessage({ contactIds: [contactId] })
    const unrelated = await seedMessage({ contactIds: [otherContactId] })
    const fromOtherClient = await seedMessage({ contactIds: [contactId] }, otherClientId)
    const untouched = await Promise.all([unrelated.get(), fromOtherClient.get()])

    await expect(removeContactFromMessages(db, { contactId, clientId })).resolves.toEqual({
      updated: 2,
      deleted: 1,
      failed: 0,
    })

    const sharedAfter = await shared.get()
    expect(sharedAfter.get('contactIds')).toEqual([otherContactId])
    expect(sharedAfter.get('status')).toBe(MESSAGE_STATUS.scheduled)
    expect(sharedAfter.get('updatedAt')).toBeInstanceOf(Timestamp)
    expect(sharedAfter.get('updatedAt')).not.toEqual(sharedAfter.get('createdAt'))

    const sentAfter = await sent.get()
    expect(sentAfter.get('contactIds')).toEqual([])
    expect(sentAfter.get('status')).toBe(MESSAGE_STATUS.sent)

    expect((await exclusive.get()).exists).toBe(false)

    for (const before of untouched) {
      const after = await before.ref.get()
      expect(after.updateTime).toEqual(before.updateTime)
    }
  })

  it('apaga a agendada quando todos os contatos são excluídos ao mesmo tempo', async () => {
    const message = await seedMessage({ contactIds: [contactId, otherContactId] })

    const summaries = await Promise.all([
      removeContactFromMessages(db, { contactId, clientId }),
      removeContactFromMessages(db, { contactId: otherContactId, clientId }),
    ])

    expect((await message.get()).exists).toBe(false)
    expect(summaries.reduce((total, summary) => total + summary.deleted, 0)).toBe(1)
    expect(summaries.map((summary) => summary.failed)).toEqual([0, 0])
  })

  it('percorre todas as páginas de mensagens com o contato', async () => {
    const messages = await Promise.all(
      Array.from({ length: 5 }, () => seedMessage({ contactIds: [contactId, otherContactId] })),
    )

    await expect(removeContactFromMessages(db, { contactId, clientId }, 2)).resolves.toEqual({
      updated: 5,
      deleted: 0,
      failed: 0,
    })

    for (const message of messages) {
      expect((await message.get()).get('contactIds')).toEqual([otherContactId])
    }
  })
})
