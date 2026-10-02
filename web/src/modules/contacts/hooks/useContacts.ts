import { useMemo } from 'react'

import { useCurrentUser } from '@modules/auth/hooks/useSession'
import { useObservable } from '@shared/hooks/useObservable'

import { observeContacts } from '../services/contactsService'
import type { Contact } from '../types'

const EMPTY: Contact[] = []

export function useContacts(connectionId: string) {
  const { uid } = useCurrentUser()
  const source = useMemo(() => observeContacts(uid, connectionId), [uid, connectionId])

  return useObservable(source, EMPTY)
}
