import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { FormTextField } from '@shared/components/molecules/FormTextField'
import { FormDialog } from '@shared/components/organisms/FormDialog'

import { connectionSchema, type ConnectionInput } from '../schemas/connectionSchema'
import type { Connection } from '../types'

type ConnectionFormDialogProps = {
  open: boolean
  connection?: Connection | null
  onClose: () => void
  onSubmit: (values: ConnectionInput) => Promise<void>
}

export function ConnectionFormDialog({
  open,
  connection,
  onClose,
  onSubmit,
}: ConnectionFormDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ConnectionInput>({
    resolver: zodResolver(connectionSchema),
    defaultValues: { name: '' },
  })

  useEffect(() => {
    if (open) reset({ name: connection?.name ?? '' })
  }, [open, connection, reset])

  const isEditing = Boolean(connection)

  return (
    <FormDialog
      open={open}
      title={isEditing ? 'Editar conexão' : 'Nova conexão'}
      submitLabel={isEditing ? 'Salvar' : 'Criar conexão'}
      submitting={isSubmitting}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormTextField
        name="name"
        control={control}
        label="Nome"
        placeholder="Ex.: WhatsApp Vendas"
        autoFocus
      />
    </FormDialog>
  )
}
