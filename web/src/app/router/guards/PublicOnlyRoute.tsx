import { Navigate, Outlet } from 'react-router'

import { useSession } from '@modules/auth/hooks/useSession'
import { PageLoader } from '@shared/components/atoms/PageLoader'
import { ROUTES } from '@shared/constants/routes'

export function PublicOnlyRoute() {
  const session = useSession()

  if (session.status === 'loading') return <PageLoader />
  if (session.status === 'authenticated') return <Navigate to={ROUTES.home} replace />

  return <Outlet />
}
