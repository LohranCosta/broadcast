import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import { useMemo } from 'react'

import type { Contact } from '@modules/contacts/types'
import { formatPhone } from '@shared/utils/phone'

type ContactSelectorProps = {
  contacts: Contact[]
  value: string[]
  onChange: (contactIds: string[]) => void
  onBlur?: () => void
  error?: string
}

export function ContactSelector({
  contacts,
  value,
  onChange,
  onBlur,
  error,
}: ContactSelectorProps) {
  const selected = useMemo(
    () => contacts.filter((contact) => value.includes(contact.id)),
    [contacts, value],
  )
  const allSelected = contacts.length > 0 && selected.length === contacts.length

  const toggleAll = () => onChange(allSelected ? [] : contacts.map((contact) => contact.id))

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium">Contatos</span>
        <Button size="small" onClick={toggleAll} disabled={contacts.length === 0}>
          {allSelected ? 'Limpar seleção' : 'Selecionar todos'}
        </Button>
      </div>

      <Autocomplete
        multiple
        disableCloseOnSelect
        limitTags={3}
        options={contacts}
        value={selected}
        onChange={(_, next) => onChange(next.map((contact) => contact.id))}
        onBlur={onBlur}
        getOptionLabel={(contact) => contact.name}
        isOptionEqualToValue={(option, current) => option.id === current.id}
        noOptionsText="Nenhum contato encontrado"
        renderOption={({ key, ...props }, contact, { selected: isSelected }) => (
          <li key={key} {...props}>
            <Checkbox size="small" checked={isSelected} className="mr-2 -ml-2" />
            <span className="flex flex-col">
              <span className="text-sm">{contact.name}</span>
              <span className="text-xs text-muted">{formatPhone(contact.phone)}</span>
            </span>
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            aria-label="Contatos"
            placeholder={selected.length ? '' : 'Busque ou selecione os contatos'}
            error={Boolean(error)}
            helperText={error ?? `${selected.length} de ${contacts.length} selecionado(s)`}
          />
        )}
      />
    </div>
  )
}
