import { z } from 'zod'

export const connectionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Informe o nome da conexão')
    .max(60, 'Use no máximo 60 caracteres'),
})

export type ConnectionInput = z.infer<typeof connectionSchema>
