import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { SignUpForm } from './SignUpForm'

const fillForm = async (user: ReturnType<typeof userEvent.setup>, confirmPassword: string) => {
  await user.type(screen.getByLabelText('Nome'), ' Ana Souza ')
  await user.type(screen.getByLabelText('E-mail'), 'ana@email.com')
  await user.type(screen.getByLabelText('Senha'), '123456')
  await user.type(screen.getByLabelText('Confirmar senha'), confirmPassword)
  await user.click(screen.getByRole('button', { name: 'Criar conta' }))
}

describe('SignUpForm', () => {
  it('não deixa enviar com senhas diferentes', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<SignUpForm onSubmit={onSubmit} />)

    await fillForm(user, '654321')

    expect(await screen.findByText('As senhas não conferem')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('envia os dados sem a confirmação de senha', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<SignUpForm onSubmit={onSubmit} />)

    await fillForm(user, '123456')

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Ana Souza',
      email: 'ana@email.com',
      password: '123456',
    })
  })

  it('avisa quando o e-mail já está em uso', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockRejectedValue({ code: 'auth/email-already-in-use' })
    render(<SignUpForm onSubmit={onSubmit} />)

    await fillForm(user, '123456')

    expect(await screen.findByText('Já existe uma conta com este e-mail.')).toBeInTheDocument()
  })
})
