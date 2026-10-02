import ForumRoundedIcon from '@mui/icons-material/ForumRounded'
import Alert from '@mui/material/Alert'
import Skeleton from '@mui/material/Skeleton'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import { useAtom } from 'jotai'

import { EmptyState } from '@shared/components/molecules/EmptyState'

import { messageFilterAtom } from '../store/messageFilter'
import type { Message, MessageFilter } from '../types'
import { MessageCard } from './MessageCard'

type MessageListProps = {
  messages: Message[]
  loading: boolean
  error: Error | null
  contactNames: Map<string, string>
}

const FILTERS: Array<{ value: MessageFilter; label: string }> = [
  { value: 'all', label: 'Todas' },
  { value: 'sent', label: 'Enviadas' },
  { value: 'scheduled', label: 'Agendadas' },
]

const EMPTY_TEXT: Record<MessageFilter, string> = {
  all: 'As mensagens enviadas e agendadas desta conexão aparecem aqui.',
  sent: 'Nenhuma mensagem enviada por enquanto.',
  scheduled: 'Nenhuma mensagem agendada no momento.',
}

export function MessageList({ messages, loading, error, contactNames }: MessageListProps) {
  const [filter, setFilter] = useAtom(messageFilterAtom)

  const namesOf = (message: Message) =>
    message.contactIds.flatMap((id) => contactNames.get(id) ?? [])

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Typography variant="h6" component="h2" className="font-semibold">
          Mensagens
        </Typography>
        <ToggleButtonGroup
          exclusive
          size="small"
          color="primary"
          value={filter}
          onChange={(_, value: MessageFilter | null) => value && setFilter(value)}
          aria-label="Filtrar mensagens"
        >
          {FILTERS.map(({ value, label }) => (
            <ToggleButton key={value} value={value} className="px-3">
              {label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>

      {error && (
        <Alert severity="error" className="mb-4">
          Não foi possível carregar as mensagens.
        </Alert>
      )}

      {loading ? (
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} variant="rounded" height={112} className="rounded-2xl" />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <EmptyState
          icon={<ForumRoundedIcon />}
          title="Nenhuma mensagem"
          description={EMPTY_TEXT[filter]}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((message) => (
            <MessageCard key={message.id} message={message} recipientNames={namesOf(message)} />
          ))}
        </div>
      )}
    </section>
  )
}
