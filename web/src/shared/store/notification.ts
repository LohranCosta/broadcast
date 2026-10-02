import { atom } from 'jotai'

export type NotificationSeverity = 'success' | 'error'

export type Notification = {
  key: number
  message: string
  severity: NotificationSeverity
  open: boolean
}

export const notificationAtom = atom<Notification | null>(null)
