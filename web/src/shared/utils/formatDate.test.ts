import { describe, expect, it } from 'vitest'

import { formatDate, formatDateTime } from './formatDate'

describe('formatDate', () => {
  const date = new Date(2026, 9, 2, 14, 5)

  it('formata a data no padrão brasileiro', () => {
    expect(formatDate(date)).toBe('02/10/2026')
  })

  it('formata data e hora', () => {
    expect(formatDateTime(date)).toBe('02/10/2026 às 14:05')
  })
})
