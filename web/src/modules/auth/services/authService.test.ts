import { createUserWithEmailAndPassword, type UserCredential } from 'firebase/auth'
import { setDoc } from 'firebase/firestore'
import { describe, expect, it, vi } from 'vitest'

import { signUp } from './authService'

vi.mock('@lib/firebase', () => ({ auth: {}, db: {} }))

vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn(),
  onAuthStateChanged: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  updateProfile: vi.fn(),
}))

vi.mock('firebase/firestore', () => ({
  doc: vi.fn((_db: unknown, collection: string, id: string) => `${collection}/${id}`),
  serverTimestamp: vi.fn(() => 'agora'),
  setDoc: vi.fn(),
}))

describe('signUp', () => {
  it('grava o cliente com o e-mail normalizado pelo firebase', async () => {
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({
      user: { uid: 'client-1', email: 'ana@email.com', displayName: null },
    } as unknown as UserCredential)

    await signUp({ name: 'Ana', email: 'Ana@Email.com', password: '123456' })

    expect(setDoc).toHaveBeenCalledWith('clients/client-1', {
      name: 'Ana',
      email: 'ana@email.com',
      createdAt: 'agora',
    })
  })
})
