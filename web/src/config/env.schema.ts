import { z } from 'zod'

const envSchema = z.object({
  VITE_FIREBASE_API_KEY: z.string().min(1),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().min(1),
  VITE_FIREBASE_PROJECT_ID: z.string().min(1),
  VITE_FIREBASE_STORAGE_BUCKET: z.string().optional(),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
  VITE_FIREBASE_APP_ID: z.string().min(1),
  VITE_USE_EMULATORS: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
})

export type Env = {
  firebase: {
    apiKey: string
    authDomain: string
    projectId: string
    storageBucket?: string
    messagingSenderId?: string
    appId: string
  }
  useEmulators: boolean
}

export function parseEnv(source: Record<string, unknown>): Env {
  const result = envSchema.safeParse(source)

  if (!result.success) {
    const fields = result.error.issues.map((issue) => issue.path.join('.')).join(', ')
    throw new Error(`Variáveis de ambiente inválidas ou ausentes: ${fields}. Veja o .env.example`)
  }

  const { data } = result

  return {
    firebase: {
      apiKey: data.VITE_FIREBASE_API_KEY,
      authDomain: data.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: data.VITE_FIREBASE_PROJECT_ID,
      storageBucket: data.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: data.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: data.VITE_FIREBASE_APP_ID,
    },
    useEmulators: data.VITE_USE_EMULATORS,
  }
}
