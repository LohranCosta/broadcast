import { z } from 'zod'

export const MESSAGE_MAX_LENGTH = 1000

export const messageSchema = z
  .object({
    contactIds: z.array(z.string()).min(1, 'Selecione pelo menos um contato'),
    content: z
      .string()
      .trim()
      .min(1, 'Escreva a mensagem')
      .max(MESSAGE_MAX_LENGTH, `Use no máximo ${MESSAGE_MAX_LENGTH} caracteres`),
    mode: z.enum(['now', 'schedule']),
    scheduledAt: z.date().nullable(),
  })
  .superRefine((values, context) => {
    if (values.mode !== 'schedule') return

    if (!values.scheduledAt) {
      context.addIssue({
        code: 'custom',
        path: ['scheduledAt'],
        message: 'Escolha a data e o horário do envio',
      })
    } else if (values.scheduledAt.getTime() <= Date.now()) {
      context.addIssue({
        code: 'custom',
        path: ['scheduledAt'],
        message: 'Escolha um horário no futuro',
      })
    }
  })

export type MessageInput = z.infer<typeof messageSchema>

export const EMPTY_MESSAGE: MessageInput = {
  contactIds: [],
  content: '',
  mode: 'now',
  scheduledAt: null,
}
