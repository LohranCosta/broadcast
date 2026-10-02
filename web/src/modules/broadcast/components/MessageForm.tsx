import { zodResolver } from '@hookform/resolvers/zod'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import Button from '@mui/material/Button'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import dayjs from 'dayjs'
import { Controller, useForm, useWatch } from 'react-hook-form'

import type { Contact } from '@modules/contacts/types'
import { FormTextField } from '@shared/components/molecules/FormTextField'

import {
  EMPTY_MESSAGE,
  MESSAGE_MAX_LENGTH,
  messageSchema,
  type MessageInput,
} from '../schemas/messageSchema'
import { ContactSelector } from './ContactSelector'

type MessageFormProps = {
  contacts: Contact[]
  defaultValues?: MessageInput
  submitLabels?: Record<MessageInput['mode'], string>
  onSubmit: (values: MessageInput) => Promise<boolean>
  onCancel?: () => void
  resetOnSuccess?: boolean
}

const DEFAULT_LABELS = { now: 'Enviar mensagem', schedule: 'Agendar mensagem' }

export function MessageForm({
  contacts,
  defaultValues = EMPTY_MESSAGE,
  submitLabels = DEFAULT_LABELS,
  onSubmit,
  onCancel,
  resetOnSuccess = false,
}: MessageFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<MessageInput>({
    resolver: zodResolver(messageSchema),
    defaultValues,
  })
  const mode = useWatch({ control, name: 'mode' })
  const content = useWatch({ control, name: 'content' })

  const submit = handleSubmit(async (values) => {
    const saved = await onSubmit(values)
    if (saved && resetOnSuccess) reset(EMPTY_MESSAGE)
  })

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <Controller
        name="contactIds"
        control={control}
        render={({ field, fieldState }) => (
          <ContactSelector
            contacts={contacts}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
          />
        )}
      />

      <FormTextField
        name="content"
        control={control}
        label="Mensagem"
        placeholder="Escreva o que seus contatos vão receber"
        multiline
        minRows={4}
        helperText={`${content.length}/${MESSAGE_MAX_LENGTH}`}
      />

      <Controller
        name="mode"
        control={control}
        render={({ field }) => (
          <ToggleButtonGroup
            exclusive
            fullWidth
            size="small"
            color="primary"
            value={field.value}
            onChange={(_, value) => value && field.onChange(value)}
          >
            <ToggleButton value="now" className="gap-2">
              <SendRoundedIcon fontSize="small" />
              Enviar agora
            </ToggleButton>
            <ToggleButton value="schedule" className="gap-2">
              <ScheduleRoundedIcon fontSize="small" />
              Agendar
            </ToggleButton>
          </ToggleButtonGroup>
        )}
      />

      {mode === 'schedule' && (
        <Controller
          name="scheduledAt"
          control={control}
          render={({ field, fieldState }) => (
            <DateTimePicker
              label="Data e horário do envio"
              value={field.value ? dayjs(field.value) : null}
              onChange={(value) => field.onChange(value?.isValid() ? value.toDate() : null)}
              disablePast
              ampm={false}
              slotProps={{
                textField: {
                  fullWidth: true,
                  onBlur: field.onBlur,
                  error: Boolean(fieldState.error),
                  helperText: fieldState.error?.message,
                },
              }}
            />
          )}
        />
      )}

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button color="inherit" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          variant="contained"
          loading={isSubmitting}
          startIcon={mode === 'now' ? <SendRoundedIcon /> : <ScheduleRoundedIcon />}
        >
          {submitLabels[mode]}
        </Button>
      </div>
    </form>
  )
}
