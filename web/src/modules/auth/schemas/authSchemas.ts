import { z } from 'zod'

const email = z.string().trim().min(1, 'Informe seu e-mail').pipe(z.email('E-mail inválido'))

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Informe sua senha'),
})

export type LoginValues = z.infer<typeof loginSchema>
