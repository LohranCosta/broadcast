import { initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'

import { env } from '@config/env'

const EMULATOR_HOST = '127.0.0.1'

export const firebaseApp = initializeApp(env.firebase)
export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)

if (env.useEmulators) {
  connectAuthEmulator(auth, `http://${EMULATOR_HOST}:9099`, { disableWarnings: true })
  connectFirestoreEmulator(db, EMULATOR_HOST, 8080)
}
