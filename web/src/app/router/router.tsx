import { createBrowserRouter, Navigate, Outlet } from 'react-router'

import { PageLoader } from '@shared/components/atoms/PageLoader'
import { AuthLayout } from '@shared/components/templates/AuthLayout'
import { ROUTES } from '@shared/constants/routes'

import { PrivateRoute } from './guards/PrivateRoute'
import { PublicOnlyRoute } from './guards/PublicOnlyRoute'
import { PrivateLayout } from './layouts/PrivateLayout'
import { RouteError } from './RouteError'

export const router = createBrowserRouter([
  {
    hydrateFallbackElement: <PageLoader />,
    errorElement: <RouteError />,
    children: [
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
              {
                path: ROUTES.login,
                lazy: async () => ({
                  Component: (await import('@modules/auth/pages/LoginPage')).LoginPage,
                }),
              },
              {
                path: ROUTES.signUp,
                lazy: async () => ({
                  Component: (await import('@modules/auth/pages/SignUpPage')).SignUpPage,
                }),
              },
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
              {
                path: ROUTES.connections,
                lazy: async () => ({
                  Component: (await import('@modules/connections/pages/ConnectionsPage'))
                    .ConnectionsPage,
                }),
              },
              {
                path: ROUTES.connection,
                lazy: async () => ({
                  Component: (await import('@modules/connections/pages/ConnectionPage'))
                    .ConnectionPage,
                }),
                children: [
                  { index: true, element: <Navigate to="contatos" replace /> },
                  {
                    path: 'contatos',
                    lazy: async () => ({
                      Component: (await import('@modules/contacts/pages/ContactsPage'))
                        .ContactsPage,
                    }),
                  },
                  {
                    path: 'broadcast',
                    lazy: async () => ({
                      Component: (await import('@modules/broadcast/pages/BroadcastPage'))
                        .BroadcastPage,
                    }),
                  },
                ],
              },
            ],
          },
        ],
      },
      { path: '*', element: <Navigate to={ROUTES.home} replace /> },
    ],
  },
])
