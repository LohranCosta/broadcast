import { describe, expect, it } from 'vitest'

import { formatRecipients } from './formatRecipients'

describe('formatRecipients', () => {
  it('mostra um único contato', () => {
    expect(formatRecipients(['Ana'])).toBe('Ana')
  })

  it('junta os nomes com "e" no final', () => {
    expect(formatRecipients(['Ana', 'Bia', 'Caio'])).toBe('Ana, Bia e Caio')
  })

  it('resume quando há muitos contatos', () => {
    expect(formatRecipients(['Ana', 'Bia', 'Caio', 'Davi', 'Eva'])).toBe('Ana, Bia, Caio e mais 2')
  })

  it('avisa quando não há contatos', () => {
    expect(formatRecipients([])).toBe('Nenhum contato')
  })
})
