import { useMemo } from 'react'

import { useObservable } from '@shared/hooks/useObservable'

import { observeConnection } from '../services/connectionsService'

export function useConnection(connectionId: string) {
  const source = useMemo(() => observeConnection(connectionId), [connectionId])

  return useObservable(source, null)
}
