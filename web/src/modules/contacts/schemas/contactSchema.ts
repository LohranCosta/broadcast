import { z } from 'zod'

import { onlyDigits } from '@shared/utils/phone'

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Informe o nome do contato')
    .max(80, 'Use no máximo 80 caracteres'),
  phone: z
    .string()
    .transform(onlyDigits)
    .pipe(z.string().regex(/^\d{10,11}$/, 'Informe um telefone com DDD')),
})

export type ContactFormValues = z.input<typeof contactSchema>
export type ContactInput = z.output<typeof contactSchema>
