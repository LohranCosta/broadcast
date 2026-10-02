import { createStore } from 'jotai'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { observeAuthState } from '../services/authService'
import type { SessionUser } from '../types'
import { clientIdAtom, sessionAtom } from './session'

vi.mock('../services/authService', () => ({
  observeAuthState: vi.fn(),
}))

const user: SessionUser = { uid: 'client-1', email: 'ana@email.com', name: 'Ana' }

describe('sessionAtom', () => {
  let emit: (user: SessionUser | null) => void
  const unsubscribe = vi.fn()

  beforeEach(() => {
    vi.mocked(observeAuthState).mockImplementation((callback) => {
      emit = callback
      return unsubscribe
    })
  })

  it('começa carregando até o firebase responder', () => {
    const store = createStore()
    store.sub(sessionAtom, () => {})

    expect(store.get(sessionAtom)).toEqual({ status: 'loading' })
    expect(store.get(clientIdAtom)).toBeNull()
  })

  it('acompanha login e logout do usuário', () => {
    const store = createStore()
    store.sub(clientIdAtom, () => {})

    emit(user)
    expect(store.get(sessionAtom)).toEqual({ status: 'authenticated', user })
    expect(store.get(clientIdAtom)).toBe('client-1')

    emit(null)
    expect(store.get(sessionAtom)).toEqual({ status: 'unauthenticated' })
    expect(store.get(clientIdAtom)).toBeNull()
  })

  it('para de escutar o auth quando ninguém mais usa a sessão', () => {
    const store = createStore()
    const unsub = store.sub(sessionAtom, () => {})

    unsub()

    expect(unsubscribe).toHaveBeenCalledOnce()
  })
})
