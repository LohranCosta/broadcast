import TextField from '@mui/material/TextField'
import { Controller, type FieldValues } from 'react-hook-form'

import { formatPhone } from '@shared/utils/phone'

import type { FormTextFieldProps } from './FormTextField'

export function FormPhoneField<T extends FieldValues>({
  name,
  control,
  helperText,
  ...props
}: FormTextFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, value, onChange, ...field }, fieldState }) => (
        <TextField
          {...props}
          {...field}
          type="tel"
          value={formatPhone(value ?? '')}
          onChange={(event) => onChange(formatPhone(event.target.value))}
          inputRef={ref}
          placeholder="(11) 91234-5678"
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message ?? helperText}
          slotProps={{ htmlInput: { inputMode: 'numeric' } }}
        />
      )}
    />
  )
}
