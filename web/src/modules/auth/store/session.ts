import { atom } from 'jotai'

import { observeAuthState } from '../services/authService'
import type { Session } from '../types'

export const sessionAtom = atom<Session>({ status: 'loading' })

// Só escuta o Firebase Auth enquanto existir algum componente usando a sessão
sessionAtom.onMount = (setSession) =>
  observeAuthState((user) =>
    setSession(user ? { status: 'authenticated', user } : { status: 'unauthenticated' }),
  )

export const clientIdAtom = atom((get) => {
  const session = get(sessionAtom)
  return session.status === 'authenticated' ? session.user.uid : null
})
