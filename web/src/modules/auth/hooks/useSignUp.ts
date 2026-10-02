import { useSetAtom } from 'jotai'
import { useCallback } from 'react'

import { signUp } from '../services/authService'
import { sessionAtom } from '../store/session'
import type { SignUpInput } from '../types'

export function useSignUp() {
  const setSession = useSetAtom(sessionAtom)

  return useCallback(
    async (input: SignUpInput) => {
      const user = await signUp(input)
      setSession({ status: 'authenticated', user })
    },
    [setSession],
  )
}
