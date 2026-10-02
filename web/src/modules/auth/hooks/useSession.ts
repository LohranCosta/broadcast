import { useAtomValue } from 'jotai'

import { sessionAtom } from '../store/session'
import type { SessionUser } from '../types'

export const useSession = () => useAtomValue(sessionAtom)

export function useCurrentUser(): SessionUser {
  const session = useSession()

  if (session.status !== 'authenticated') {
    throw new Error('useCurrentUser precisa ser usado dentro de uma rota protegida')
  }

  return session.user
}
