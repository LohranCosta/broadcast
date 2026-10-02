import { z } from 'zod'

const email = z.string().trim().min(1, 'Informe seu e-mail').pipe(z.email('E-mail inválido'))

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Informe sua senha'),
})

export const signUpSchema = z
  .object({
    name: z.string().trim().min(2, 'Informe seu nome').max(80, 'Use no máximo 80 caracteres'),
    email,
    password: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    error: 'As senhas não conferem',
    path: ['confirmPassword'],
  })

export type LoginValues = z.infer<typeof loginSchema>
export type SignUpValues = z.infer<typeof signUpSchema>
