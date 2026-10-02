import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { useAtom } from 'jotai'

import { notificationAtom } from '@shared/store/notification'

export function NotificationSnackbar() {
  const [notification, setNotification] = useAtom(notificationAtom)

  const close = () => setNotification((current) => current && { ...current, open: false })

  return (
    <Snackbar
      key={notification?.key}
      open={notification?.open ?? false}
      autoHideDuration={4000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      onClose={(_, reason) => reason !== 'clickaway' && close()}
    >
      <Alert severity={notification?.severity ?? 'success'} variant="filled" onClose={close}>
        {notification?.message}
      </Alert>
    </Snackbar>
  )
}
