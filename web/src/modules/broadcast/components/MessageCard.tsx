import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { memo } from 'react'

import { formatDateTime } from '@shared/utils/formatDate'

import type { Message } from '../types'
import { formatRecipients } from '../utils/formatRecipients'
import { MessageStatusChip } from './MessageStatusChip'

type MessageCardProps = {
  message: Message
  recipientNames: string[]
  onEdit: (message: Message) => void
  onDelete: (message: Message) => void
}

function describeTiming({ status, scheduledAt, sentAt }: Message) {
  if (status === 'scheduled') {
    return scheduledAt ? `Agendada para ${formatDateTime(scheduledAt)}` : 'Agendada'
  }

  return sentAt ? `Enviada em ${formatDateTime(sentAt)}` : 'Enviando...'
}

export const MessageCard = memo(function MessageCard({
  message,
  recipientNames,
  onEdit,
  onDelete,
}: MessageCardProps) {
  return (
    <Paper className="rounded-2xl border border-border p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <MessageStatusChip status={message.status} />
        <Typography className="text-xs text-muted">{describeTiming(message)}</Typography>
      </div>

      <Typography className="text-sm break-words whitespace-pre-line">{message.content}</Typography>

      <div className="mt-3 flex items-center justify-between gap-3">
        <Typography className="flex min-w-0 items-center gap-1.5 text-xs text-muted">
          <PeopleAltRoundedIcon className="text-base" />
          <span className="truncate">{formatRecipients(recipientNames)}</span>
        </Typography>
        <div className="flex shrink-0">
          <Tooltip title="Editar">
            <IconButton size="small" aria-label="Editar mensagem" onClick={() => onEdit(message)}>
              <EditRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton
              size="small"
              aria-label="Excluir mensagem"
              onClick={() => onDelete(message)}
            >
              <DeleteOutlineRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </Paper>
  )
})
