export type MessageStatus = 'scheduled' | 'sent'

export type MessageFilter = 'all' | MessageStatus

export type Message = {
  id: string
  connectionId: string
  contactIds: string[]
  content: string
  status: MessageStatus
  scheduledAt: Date | null
  sentAt: Date | null
  createdAt: Date | null
}
