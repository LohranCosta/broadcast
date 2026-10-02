import { useAtomValue } from 'jotai'
import { useMemo } from 'react'

import { useCurrentUser } from '@modules/auth/hooks/useSession'
import { useObservable } from '@shared/hooks/useObservable'

import { observeMessages } from '../services/messagesService'
import { messageFilterAtom } from '../store/messageFilter'
import type { Message } from '../types'

const EMPTY: Message[] = []

export function useMessages(connectionId: string) {
  const { uid } = useCurrentUser()
  const filter = useAtomValue(messageFilterAtom)
  const source = useMemo(
    () => observeMessages(uid, connectionId, filter),
    [uid, connectionId, filter],
  )

  return useObservable(source, EMPTY)
}
