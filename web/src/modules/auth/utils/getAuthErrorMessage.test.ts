import { describe, expect, it } from 'vitest'

import { getAuthErrorMessage } from './getAuthErrorMessage'

describe('getAuthErrorMessage', () => {
  it('traduz os códigos de erro do firebase auth', () => {
    expect(getAuthErrorMessage({ code: 'auth/invalid-credential' })).toBe(
      'E-mail ou senha incorretos.',
    )
    expect(getAuthErrorMessage({ code: 'auth/email-already-in-use' })).toBe(
      'Já existe uma conta com este e-mail.',
    )
  })

  it('não diferencia senha errada de usuário inexistente', () => {
    const codes = ['auth/invalid-credential', 'auth/wrong-password', 'auth/user-not-found']

    codes.forEach((code) => {
      expect(getAuthErrorMessage({ code })).toBe('E-mail ou senha incorretos.')
    })
  })

  it('usa uma mensagem genérica para erros desconhecidos', () => {
    expect(getAuthErrorMessage({ code: 'auth/qualquer-coisa' })).toBe(
      'Não foi possível concluir. Tente novamente.',
    )
    expect(getAuthErrorMessage(new Error('boom'))).toBe(
      'Não foi possível concluir. Tente novamente.',
    )
    expect(getAuthErrorMessage(undefined)).toBe('Não foi possível concluir. Tente novamente.')
  })
})
