import { RouterProvider } from 'react-router/dom'

import { NotificationSnackbar } from '@shared/components/organisms/NotificationSnackbar'

import { router } from './router/router'

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <NotificationSnackbar />
    </>
  )
}
