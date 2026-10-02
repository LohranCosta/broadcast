import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { Link as RouterLink, useNavigate } from 'react-router'

import { ROUTES } from '@shared/constants/routes'

import { SignUpForm } from '../components/SignUpForm'
import { useSignUp } from '../hooks/useSignUp'
import type { SignUpInput } from '../types'

export function SignUpPage() {
  const navigate = useNavigate()
  const signUp = useSignUp()

  const handleSubmit = async (input: SignUpInput) => {
    await signUp(input)
    navigate(ROUTES.home, { replace: true })
  }

  return (
    <>
      <Typography variant="h5" component="h1" className="font-semibold">
        Criar conta
      </Typography>
      <Typography className="mt-1 mb-6 text-sm text-muted">
        Cadastre-se para começar a enviar mensagens aos seus contatos.
      </Typography>

      <SignUpForm onSubmit={handleSubmit} />

      <Typography className="mt-6 text-center text-sm text-muted">
        Já tem conta?{' '}
        <Link component={RouterLink} to={ROUTES.login} underline="hover">
          Entrar
        </Link>
      </Typography>
    </>
  )
}
