import { useSetAtom } from 'jotai'
import { useMemo } from 'react'

import { notificationAtom, type NotificationSeverity } from '@shared/store/notification'

export function useNotify() {
  const setNotification = useSetAtom(notificationAtom)

  return useMemo(() => {
    const notify = (severity: NotificationSeverity) => (message: string) =>
      setNotification({ key: Date.now(), message, severity, open: true })

    return { success: notify('success'), error: notify('error') }
  }, [setNotification])
}
