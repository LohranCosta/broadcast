import { createBrowserRouter, Navigate, Outlet } from 'react-router'

import { LoginPage } from '@modules/auth/pages/LoginPage'
import { SignUpPage } from '@modules/auth/pages/SignUpPage'
import { AuthLayout } from '@shared/components/templates/AuthLayout'
import { ROUTES } from '@shared/constants/routes'

export const router = createBrowserRouter([
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
  { path: '*', element: <Navigate to={ROUTES.login} replace /> },
])
