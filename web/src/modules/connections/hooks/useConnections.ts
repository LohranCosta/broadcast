import { useMemo } from 'react'

import { useCurrentUser } from '@modules/auth/hooks/useSession'
import { useObservable } from '@shared/hooks/useObservable'

import { observeConnections } from '../services/connectionsService'
import type { Connection } from '../types'

const EMPTY: Connection[] = []

export function useConnections() {
  const { uid } = useCurrentUser()
  const source = useMemo(() => observeConnections(uid), [uid])

  return useObservable(source, EMPTY)
}
