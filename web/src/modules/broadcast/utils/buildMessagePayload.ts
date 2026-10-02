import { serverTimestamp, Timestamp } from 'firebase/firestore'

import type { MessageInput } from '../schemas/messageSchema'

export function buildMessagePayload({ contactIds, content, mode, scheduledAt }: MessageInput) {
  if (mode === 'schedule' && scheduledAt) {
    return {
      contactIds,
      content,
      status: 'scheduled' as const,
      scheduledAt: Timestamp.fromDate(scheduledAt),
      sentAt: null,
    }
  }

  return {
    contactIds,
    content,
    status: 'sent' as const,
    scheduledAt: null,
    sentAt: serverTimestamp(),
  }
}
