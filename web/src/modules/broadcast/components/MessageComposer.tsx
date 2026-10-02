import Alert from '@mui/material/Alert'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router'

import type { Contact } from '@modules/contacts/types'
import { ROUTES } from '@shared/constants/routes'

import type { MessageInput } from '../schemas/messageSchema'
import { MessageForm } from './MessageForm'

type MessageComposerProps = {
  connectionId: string
  contacts: Contact[]
  loading: boolean
  onSubmit: (values: MessageInput) => Promise<boolean>
}

export function MessageComposer({
  connectionId,
  contacts,
  loading,
  onSubmit,
}: MessageComposerProps) {
  return (
    <Paper className="rounded-2xl border border-border p-5 lg:sticky lg:top-6">
      <Typography variant="h6" component="h2" className="mb-4 font-semibold">
        Nova mensagem
      </Typography>

      {loading ? (
        <Skeleton variant="rounded" height={260} />
      ) : contacts.length === 0 ? (
        <Alert severity="info">
          Esta conexão ainda não tem contatos.{' '}
          <Link component={RouterLink} to={ROUTES.contacts(connectionId)}>
            Cadastre os contatos
          </Link>{' '}
          para começar a enviar mensagens.
        </Alert>
      ) : (
        <MessageForm contacts={contacts} onSubmit={onSubmit} resetOnSuccess />
      )}
    </Paper>
  )
}
