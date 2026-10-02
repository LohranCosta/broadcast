import { zodResolver } from '@hookform/resolvers/zod'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { FormPasswordField } from '@shared/components/molecules/FormPasswordField'
import { FormTextField } from '@shared/components/molecules/FormTextField'

import { signUpSchema, type SignUpValues } from '../schemas/authSchemas'
import type { SignUpInput } from '../types'
import { getAuthErrorMessage } from '../utils/getAuthErrorMessage'

type SignUpFormProps = {
  onSubmit: (input: SignUpInput) => Promise<void>
}

export function SignUpForm({ onSubmit }: SignUpFormProps) {
  const [error, setError] = useState<string | null>(null)
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const submit = handleSubmit(async ({ name, email, password }) => {
    setError(null)
    try {
      await onSubmit({ name, email, password })
    } catch (err) {
      setError(getAuthErrorMessage(err))
    }
  })

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      {error && <Alert severity="error">{error}</Alert>}

      <FormTextField name="name" control={control} label="Nome" autoComplete="name" autoFocus />
      <FormTextField
        name="email"
        control={control}
        label="E-mail"
        type="email"
        autoComplete="email"
      />
      <FormPasswordField
        name="password"
        control={control}
        label="Senha"
        autoComplete="new-password"
      />
      <FormPasswordField
        name="confirmPassword"
        control={control}
        label="Confirmar senha"
        autoComplete="new-password"
      />

      <Button type="submit" variant="contained" size="large" loading={isSubmitting}>
        Criar conta
      </Button>
    </form>
  )
}
