import { describe, expect, it } from 'vitest'

import { messageSchema } from './messageSchema'

const base = { contactIds: ['c1'], content: ' Olá! ', mode: 'now' as const, scheduledAt: null }

const errorsOf = (values: unknown) => {
  const result = messageSchema.safeParse(values)
  return result.success ? [] : result.error.issues.map((issue) => issue.message)
}

describe('messageSchema', () => {
  it('aceita envio imediato e remove espaços da mensagem', () => {
    expect(messageSchema.parse(base).content).toBe('Olá!')
  })

  it('exige pelo menos um contato e o texto', () => {
    expect(errorsOf({ ...base, contactIds: [], content: '  ' })).toEqual([
      'Selecione pelo menos um contato',
      'Escreva a mensagem',
    ])
  })

  it('exige data ao agendar', () => {
    expect(errorsOf({ ...base, mode: 'schedule' })).toEqual(['Escolha a data e o horário do envio'])
  })

  it('não deixa agendar no passado', () => {
    const past = new Date(Date.now() - 60_000)

    expect(errorsOf({ ...base, mode: 'schedule', scheduledAt: past })).toEqual([
      'Escolha um horário no futuro',
    ])
  })

  it('aceita agendamento no futuro', () => {
    const future = new Date(Date.now() + 60 * 60_000)

    expect(errorsOf({ ...base, mode: 'schedule', scheduledAt: future })).toEqual([])
  })
})
