import { describe, expect, it } from 'vitest'

import { parseEnv } from './env.schema'

const validSource = {
  VITE_FIREBASE_API_KEY: 'api-key',
  VITE_FIREBASE_AUTH_DOMAIN: 'broadcast.firebaseapp.com',
  VITE_FIREBASE_PROJECT_ID: 'broadcast',
  VITE_FIREBASE_APP_ID: '1:123:web:abc',
}

describe('parseEnv', () => {
  it('monta a configuração do firebase a partir das variáveis', () => {
    const env = parseEnv(validSource)

    expect(env.firebase).toMatchObject({
      apiKey: 'api-key',
      authDomain: 'broadcast.firebaseapp.com',
      projectId: 'broadcast',
      appId: '1:123:web:abc',
    })
  })

  it('desliga os emuladores por padrão', () => {
    expect(parseEnv(validSource).useEmulators).toBe(false)
  })

  it('converte VITE_USE_EMULATORS para boolean', () => {
    expect(parseEnv({ ...validSource, VITE_USE_EMULATORS: 'true' }).useEmulators).toBe(true)
  })

  it('lista as variáveis que estão faltando', () => {
    const source = { ...validSource, VITE_FIREBASE_API_KEY: '', VITE_FIREBASE_APP_ID: undefined }

    expect(() => parseEnv(source)).toThrow(/VITE_FIREBASE_API_KEY, VITE_FIREBASE_APP_ID/)
  })
})
