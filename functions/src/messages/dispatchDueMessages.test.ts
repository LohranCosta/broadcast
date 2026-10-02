import { Timestamp } from 'firebase-admin/firestore'
import { afterEach, describe, expect, it } from 'vitest'

import { COLLECTIONS, MESSAGE_STATUS } from '../config'
import { withBulkWriter } from '../lib/firestore'
import {
  createSeeder,
  db,
  messageData,
  minutesFrom,
  queryDocument,
  uniqueId,
} from '../testing/firestore'
import { dispatchDueMessages, markMessagesAsSent } from './dispatchDueMessages'

describe('dispatchDueMessages', () => {
  const { seed, cleanup } = createSeeder()
  const clientId = uniqueId('client')
  const connectionId = uniqueId('connection')
  const now = new Date()

  const seedScheduled = (minutes: number) =>
    seed(
      COLLECTIONS.messages,
      messageData(clientId, connectionId, { scheduledAt: minutesFrom(now, minutes) }),
    )

  afterEach(cleanup)

  it('marca como enviadas só as mensagens agendadas vencidas', async () => {
    const overdue = await seedScheduled(-60)
    const due = await seedScheduled(-1)
    const future = await seedScheduled(60)
    const alreadySent = await seed(
      COLLECTIONS.messages,
      messageData(clientId, connectionId, {
        status: MESSAGE_STATUS.sent,
        scheduledAt: minutesFrom(now, -30),
        sentAt: minutesFrom(now, -30),
      }),
    )
    const untouched = await Promise.all([future.get(), alreadySent.get()])

    await expect(dispatchDueMessages(db, now)).resolves.toEqual({ sent: 2, skipped: 0 })

    for (const message of [overdue, due]) {
      const snapshot = await message.get()
      expect(snapshot.get('status')).toBe(MESSAGE_STATUS.sent)
      expect(snapshot.get('sentAt')).toBeInstanceOf(Timestamp)
      expect(snapshot.get('updatedAt')).toEqual(snapshot.get('sentAt'))
    }

    for (const before of untouched) {
      const after = await before.ref.get()
      expect(after.updateTime).toEqual(before.updateTime)
    }
  })

  it('percorre todas as páginas de mensagens vencidas', async () => {
    const messages = await Promise.all([-5, -4, -3, -2, -1].map(seedScheduled))

    await expect(dispatchDueMessages(db, now, 2)).resolves.toEqual({ sent: 5, skipped: 0 })

    for (const message of messages) {
      expect((await message.get()).get('status')).toBe(MESSAGE_STATUS.sent)
    }
  })

  it('descarta a mensagem alterada entre a consulta e a escrita', async () => {
    const message = await seedScheduled(-1)
    const stale = await queryDocument(message)
    await message.update({ content: 'Conteúdo editado' })

    await expect(
      withBulkWriter(db, (writer) => markMessagesAsSent(writer, [stale])),
    ).resolves.toEqual({ sent: 0, skipped: 1 })

    const snapshot = await message.get()
    expect(snapshot.get('status')).toBe(MESSAGE_STATUS.scheduled)
    expect(snapshot.get('sentAt')).toBeNull()
    expect(snapshot.get('content')).toBe('Conteúdo editado')
  })

  it('envia cada mensagem uma única vez quando duas execuções concorrem', async () => {
    const messages = await Promise.all([-3, -2, -1].map(seedScheduled))

    const runs = await Promise.all([dispatchDueMessages(db, now), dispatchDueMessages(db, now)])

    expect(runs.reduce((total, run) => total + run.sent, 0)).toBe(messages.length)
    for (const message of messages) {
      expect((await message.get()).get('status')).toBe(MESSAGE_STATUS.sent)
    }
  })

  it('não altera nada quando nenhuma mensagem venceu', async () => {
    const future = await seedScheduled(1)
    const before = await future.get()

    await expect(dispatchDueMessages(db, now)).resolves.toEqual({ sent: 0, skipped: 0 })
    expect((await future.get()).updateTime).toEqual(before.updateTime)
  })
})
