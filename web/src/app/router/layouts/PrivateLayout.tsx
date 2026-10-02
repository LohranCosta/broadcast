import { Outlet } from 'react-router'

import { useCurrentUser } from '@modules/auth/hooks/useSession'
import { signOut } from '@modules/auth/services/authService'
import { AppHeader } from '@shared/components/organisms/AppHeader'
import { AppLayout } from '@shared/components/templates/AppLayout'

export function PrivateLayout() {
  const user = useCurrentUser()

  return (
    <AppLayout header={<AppHeader userName={user.name ?? user.email ?? ''} onSignOut={signOut} />}>
      <Outlet />
    </AppLayout>
  )
}
