import { createBrowserRouter, Navigate, Outlet } from 'react-router'

import { LoginPage } from '@modules/auth/pages/LoginPage'
import { SignUpPage } from '@modules/auth/pages/SignUpPage'
import { BroadcastPage } from '@modules/broadcast/pages/BroadcastPage'
import { ConnectionPage } from '@modules/connections/pages/ConnectionPage'
import { ConnectionsPage } from '@modules/connections/pages/ConnectionsPage'
import { ContactsPage } from '@modules/contacts/pages/ContactsPage'
import { AuthLayout } from '@shared/components/templates/AuthLayout'
import { ROUTES } from '@shared/constants/routes'

import { PrivateRoute } from './guards/PrivateRoute'
import { PublicOnlyRoute } from './guards/PublicOnlyRoute'
import { PrivateLayout } from './layouts/PrivateLayout'

export const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        element: (
          <AuthLayout>
            <Outlet />
          </AuthLayout>
        ),
        children: [
          { path: ROUTES.login, element: <LoginPage /> },
          { path: ROUTES.signUp, element: <SignUpPage /> },
        ],
      },
    ],
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <PrivateLayout />,
        children: [
          { index: true, element: <Navigate to={ROUTES.connections} replace /> },
          { path: ROUTES.connections, element: <ConnectionsPage /> },
          {
            path: ROUTES.connection,
            element: <ConnectionPage />,
            children: [
              { index: true, element: <Navigate to="contatos" replace /> },
              { path: 'contatos', element: <ContactsPage /> },
              { path: 'broadcast', element: <BroadcastPage /> },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to={ROUTES.home} replace /> },
])
