import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { FormPhoneField } from '@shared/components/molecules/FormPhoneField'
import { FormTextField } from '@shared/components/molecules/FormTextField'
import { FormDialog } from '@shared/components/organisms/FormDialog'
import { formatPhone } from '@shared/utils/phone'

import { contactSchema, type ContactFormValues, type ContactInput } from '../schemas/contactSchema'
import type { Contact } from '../types'

type ContactFormDialogProps = {
  open: boolean
  contact?: Contact | null
  onClose: () => void
  onSubmit: (values: ContactInput) => Promise<void>
}

export function ContactFormDialog({ open, contact, onClose, onSubmit }: ContactFormDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ContactFormValues, unknown, ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', phone: '' },
  })

  useEffect(() => {
    if (open) reset({ name: contact?.name ?? '', phone: formatPhone(contact?.phone ?? '') })
  }, [open, contact, reset])

  const isEditing = Boolean(contact)

  return (
    <FormDialog
      open={open}
      title={isEditing ? 'Editar contato' : 'Novo contato'}
      submitLabel={isEditing ? 'Salvar' : 'Adicionar contato'}
      submitting={isSubmitting}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormTextField name="name" control={control} label="Nome" autoFocus />
      <FormPhoneField name="phone" control={control} label="Telefone" />
    </FormDialog>
  )
}
