import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Tooltip from '@mui/material/Tooltip'
import { memo } from 'react'

import { formatPhone } from '@shared/utils/phone'

import type { Contact } from '../types'

type ContactListProps = {
  contacts: Contact[]
  loading: boolean
  onEdit: (contact: Contact) => void
  onDelete: (contact: Contact) => void
}

type ContactRowProps = Omit<ContactListProps, 'contacts' | 'loading'> & {
  contact: Contact
}

const ContactRow = memo(function ContactRow({ contact, onEdit, onDelete }: ContactRowProps) {
  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <Avatar className="size-9 bg-primary-light text-sm font-semibold text-primary-dark">
        {contact.name.charAt(0).toUpperCase()}
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="m-0 truncate text-sm font-medium">{contact.name}</p>
        <p className="m-0 text-xs text-muted">{formatPhone(contact.phone)}</p>
      </div>
      <Tooltip title="Editar">
        <IconButton
          size="small"
          aria-label={`Editar ${contact.name}`}
          onClick={() => onEdit(contact)}
        >
          <EditRoundedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Excluir">
        <IconButton
          size="small"
          aria-label={`Excluir ${contact.name}`}
          onClick={() => onDelete(contact)}
        >
          <DeleteOutlineRoundedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </li>
  )
})

export function ContactList({ contacts, loading, onEdit, onDelete }: ContactListProps) {
  return (
    <Paper className="overflow-hidden rounded-2xl border border-border">
      <ul className="m-0 list-none divide-y divide-border p-0">
        {loading
          ? [0, 1, 2].map((item) => (
              <li key={item} className="px-4 py-3">
                <Skeleton height={36} />
              </li>
            ))
          : contacts.map((contact) => (
              <ContactRow key={contact.id} contact={contact} onEdit={onEdit} onDelete={onDelete} />
            ))}
      </ul>
    </Paper>
  )
}
