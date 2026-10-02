import { zodResolver } from '@hookform/resolvers/zod'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { FormPasswordField } from '@shared/components/molecules/FormPasswordField'
import { FormTextField } from '@shared/components/molecules/FormTextField'

import { loginSchema, type LoginValues } from '../schemas/authSchemas'
import { getAuthErrorMessage } from '../utils/getAuthErrorMessage'

type LoginFormProps = {
  onSubmit: (values: LoginValues) => Promise<void>
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null)
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const submit = handleSubmit(async (values) => {
    setError(null)
    try {
      await onSubmit(values)
    } catch (err) {
      setError(getAuthErrorMessage(err))
    }
  })

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      {error && <Alert severity="error">{error}</Alert>}

      <FormTextField
        name="email"
        control={control}
        label="E-mail"
        type="email"
        autoComplete="email"
        autoFocus
      />
      <FormPasswordField
        name="password"
        control={control}
        label="Senha"
        autoComplete="current-password"
      />

      <Button type="submit" variant="contained" size="large" loading={isSubmitting}>
        Entrar
      </Button>
    </form>
  )
}
