import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import type { Contact } from '@modules/contacts/types'

import type { MessageInput } from '../schemas/messageSchema'
import type { Message } from '../types'
import { MessageForm } from './MessageForm'

type EditMessageDialogProps = {
  open: boolean
  message: Message | null
  contacts: Contact[]
  onClose: () => void
  onSubmit: (values: MessageInput) => Promise<boolean>
}

const toFormValues = (message: Message, contacts: Contact[]): MessageInput => ({
  contactIds: message.contactIds.filter((id) => contacts.some((contact) => contact.id === id)),
  content: message.content,
  mode: message.status === 'scheduled' ? 'schedule' : 'now',
  scheduledAt: message.scheduledAt,
})

export function EditMessageDialog({
  open,
  message,
  contacts,
  onClose,
  onSubmit,
}: EditMessageDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="font-semibold">Editar mensagem</DialogTitle>
      <DialogContent className="pt-2">
        {message && (
          <MessageForm
            key={message.id}
            contacts={contacts}
            defaultValues={toFormValues(message, contacts)}
            submitLabels={{ now: 'Salvar e enviar agora', schedule: 'Salvar agendamento' }}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
