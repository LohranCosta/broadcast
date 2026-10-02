import { useMemo, useState } from 'react'
import { useParams } from 'react-router'

import { useCurrentUser } from '@modules/auth/hooks/useSession'
import { useContacts } from '@modules/contacts/hooks/useContacts'
import { ConfirmDialog } from '@shared/components/organisms/ConfirmDialog'
import { useDialogState } from '@shared/hooks/useDialogState'
import { useNotify } from '@shared/hooks/useNotify'

import { EditMessageDialog } from '../components/EditMessageDialog'
import { MessageComposer } from '../components/MessageComposer'
import { MessageList } from '../components/MessageList'
import { useMessages } from '../hooks/useMessages'
import type { MessageInput } from '../schemas/messageSchema'
import { createMessage, deleteMessage, updateMessage } from '../services/messagesService'
import type { Message } from '../types'

export function BroadcastPage() {
  const { connectionId = '' } = useParams()
  const { uid } = useCurrentUser()
  const { data: contacts, loading: loadingContacts } = useContacts(connectionId)
  const { data: messages, loading, error } = useMessages(connectionId)
  const editDialog = useDialogState<Message>()
  const deleteDialog = useDialogState<Message>()
  const [deleting, setDeleting] = useState(false)
  const notify = useNotify()

  const contactNames = useMemo(
    () => new Map(contacts.map((contact) => [contact.id, contact.name])),
    [contacts],
  )

  const successMessage = (values: MessageInput) =>
    values.mode === 'now' ? 'Mensagem enviada' : 'Mensagem agendada'

  const handleCreate = async (values: MessageInput) => {
    try {
      await createMessage(uid, connectionId, values)
      notify.success(successMessage(values))
      return true
    } catch {
      notify.error('Não foi possível salvar a mensagem')
      return false
    }
  }

  const handleUpdate = async (values: MessageInput) => {
    if (!editDialog.item) return false

    try {
      await updateMessage(editDialog.item.id, values)
      notify.success(successMessage(values))
      editDialog.close()
      return true
    } catch {
      notify.error('Não foi possível atualizar a mensagem')
      return false
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.item) return

    setDeleting(true)
    try {
      await deleteMessage(deleteDialog.item.id)
      notify.success('Mensagem excluída')
      deleteDialog.close()
    } catch {
      notify.error('Não foi possível excluir a mensagem')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <MessageComposer
        connectionId={connectionId}
        contacts={contacts}
        loading={loadingContacts}
        onSubmit={handleCreate}
      />
      <MessageList
        messages={messages}
        loading={loading}
        error={error}
        contactNames={contactNames}
        onEdit={editDialog.open}
        onDelete={deleteDialog.open}
      />

      <EditMessageDialog
        open={editDialog.isOpen}
        message={editDialog.item}
        contacts={contacts}
        onClose={editDialog.close}
        onSubmit={handleUpdate}
      />

      <ConfirmDialog
        open={deleteDialog.isOpen}
        title="Excluir mensagem"
        description="A mensagem será removida do histórico desta conexão."
        confirmLabel="Excluir"
        loading={deleting}
        onConfirm={handleDelete}
        onClose={deleteDialog.close}
      />
    </div>
  )
}
