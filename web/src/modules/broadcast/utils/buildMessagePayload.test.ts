import { Timestamp } from 'firebase/firestore'
import { describe, expect, it } from 'vitest'

import { buildMessagePayload } from './buildMessagePayload'

const input = { contactIds: ['c1', 'c2'], content: 'Promoção de hoje' }

describe('buildMessagePayload', () => {
  it('marca como enviada quando o envio é imediato', () => {
    const payload = buildMessagePayload({ ...input, mode: 'now', scheduledAt: null })

    expect(payload).toMatchObject({ ...input, status: 'sent', scheduledAt: null })
    expect(payload.sentAt).not.toBeNull()
  })

  it('marca como agendada com a data escolhida', () => {
    const scheduledAt = new Date(2030, 0, 10, 9, 30)
    const payload = buildMessagePayload({ ...input, mode: 'schedule', scheduledAt })

    expect(payload).toMatchObject({ ...input, status: 'scheduled', sentAt: null })
    expect(payload.scheduledAt).toEqual(Timestamp.fromDate(scheduledAt))
  })
})
