import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
  type User,
} from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'

import { COLLECTIONS } from '@lib/collections'
import { auth, db } from '@lib/firebase'

import type { SessionUser, SignInInput, SignUpInput } from '../types'

export const toSessionUser = (user: User): SessionUser => ({
  uid: user.uid,
  email: user.email,
  name: user.displayName,
})

export function observeAuthState(callback: (user: SessionUser | null) => void) {
  return onAuthStateChanged(auth, (user) => callback(user ? toSessionUser(user) : null))
}

export async function signIn({ email, password }: SignInInput) {
  await signInWithEmailAndPassword(auth, email, password)
}

// Cada usuário cadastrado é um cliente da aplicação: o doc clients/{uid} representa o tenant
export async function signUp({ name, email, password }: SignUpInput): Promise<SessionUser> {
  const { user } = await createUserWithEmailAndPassword(auth, email, password)

  await updateProfile(user, { displayName: name })
  await setDoc(doc(db, COLLECTIONS.clients, user.uid), {
    name,
    email,
    createdAt: serverTimestamp(),
  })

  return toSessionUser(user)
}

export const signOut = () => firebaseSignOut(auth)
