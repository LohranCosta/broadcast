import { describe, expect, it } from 'vitest'

import { contactSchema } from './contactSchema'

describe('contactSchema', () => {
  it('guarda só os dígitos do telefone', () => {
    const result = contactSchema.parse({ name: ' Ana ', phone: '(11) 91234-5678' })

    expect(result).toEqual({ name: 'Ana', phone: '11912345678' })
  })

  it('exige telefone com DDD', () => {
    const result = contactSchema.safeParse({ name: 'Ana', phone: '91234-5678' })

    expect(result.success).toBe(false)
  })

  it('exige o nome', () => {
    const result = contactSchema.safeParse({ name: '  ', phone: '11912345678' })

    expect(result.success).toBe(false)
  })
})
