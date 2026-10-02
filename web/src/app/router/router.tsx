import { createBrowserRouter, Navigate, Outlet } from 'react-router'

import { LoginPage } from '@modules/auth/pages/LoginPage'
import { SignUpPage } from '@modules/auth/pages/SignUpPage'
import { ConnectionsPage } from '@modules/connections/pages/ConnectionsPage'
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
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to={ROUTES.home} replace /> },
])
