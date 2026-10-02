import { describe, expect, it } from 'vitest'

import { formatPhone, onlyDigits } from './phone'

describe('onlyDigits', () => {
  it('remove tudo que não é número', () => {
    expect(onlyDigits('(11) 91234-5678')).toBe('11912345678')
  })
})

describe('formatPhone', () => {
  it('formata celular com 9 dígitos', () => {
    expect(formatPhone('11912345678')).toBe('(11) 91234-5678')
  })

  it('formata telefone fixo', () => {
    expect(formatPhone('1133334444')).toBe('(11) 3333-4444')
  })

  it('aplica a máscara enquanto o usuário digita', () => {
    expect(formatPhone('1')).toBe('(1')
    expect(formatPhone('119')).toBe('(11) 9')
    expect(formatPhone('1191234')).toBe('(11) 9123-4')
  })

  it('ignora dígitos além do limite', () => {
    expect(formatPhone('119123456789999')).toBe('(11) 91234-5678')
  })

  it('retorna vazio sem dígitos', () => {
    expect(formatPhone('abc')).toBe('')
  })
})
