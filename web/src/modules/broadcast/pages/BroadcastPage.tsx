import { useMemo } from 'react'
import { useParams } from 'react-router'

import { useCurrentUser } from '@modules/auth/hooks/useSession'
import { useContacts } from '@modules/contacts/hooks/useContacts'
import { useNotify } from '@shared/hooks/useNotify'

import { MessageComposer } from '../components/MessageComposer'
import { MessageList } from '../components/MessageList'
import { useMessages } from '../hooks/useMessages'
import type { MessageInput } from '../schemas/messageSchema'
import { createMessage } from '../services/messagesService'

export function BroadcastPage() {
  const { connectionId = '' } = useParams()
  const { uid } = useCurrentUser()
  const { data: contacts, loading: loadingContacts } = useContacts(connectionId)
  const { data: messages, loading, error } = useMessages(connectionId)
  const notify = useNotify()

  const contactNames = useMemo(
    () => new Map(contacts.map((contact) => [contact.id, contact.name])),
    [contacts],
  )

  const handleCreate = async (values: MessageInput) => {
    try {
      await createMessage(uid, connectionId, values)
      notify.success(values.mode === 'now' ? 'Mensagem enviada' : 'Mensagem agendada')
      return true
    } catch {
      notify.error('Não foi possível salvar a mensagem')
      return false
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
      />
    </div>
  )
}
