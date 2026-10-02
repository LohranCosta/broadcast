import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { Link as RouterLink, useNavigate } from 'react-router'

import { ROUTES } from '@shared/constants/routes'

import { LoginForm } from '../components/LoginForm'
import type { LoginValues } from '../schemas/authSchemas'
import { signIn } from '../services/authService'

export function LoginPage() {
  const navigate = useNavigate()

  const handleSubmit = async (values: LoginValues) => {
    await signIn(values)
    navigate(ROUTES.home, { replace: true })
  }

  return (
    <>
      <Typography variant="h5" component="h1" className="font-semibold">
        Entrar
      </Typography>
      <Typography className="mt-1 mb-6 text-sm text-muted">
        Acesse sua conta para gerenciar seus disparos.
      </Typography>

      <LoginForm onSubmit={handleSubmit} />

      <Typography className="mt-6 text-center text-sm text-muted">
        Ainda não tem conta?{' '}
        <Link component={RouterLink} to={ROUTES.signUp} underline="hover">
          Cadastre-se
        </Link>
      </Typography>
    </>
  )
}
