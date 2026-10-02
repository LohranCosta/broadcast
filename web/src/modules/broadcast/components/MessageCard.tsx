import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { memo } from 'react'

import { formatDateTime } from '@shared/utils/formatDate'

import type { Message } from '../types'
import { formatRecipients } from '../utils/formatRecipients'
import { MessageStatusChip } from './MessageStatusChip'

type MessageCardProps = {
  message: Message
  recipientNames: string[]
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
}: MessageCardProps) {
  return (
    <Paper className="rounded-2xl border border-border p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <MessageStatusChip status={message.status} />
        <Typography className="text-xs text-muted">{describeTiming(message)}</Typography>
      </div>

      <Typography className="text-sm break-words whitespace-pre-line">{message.content}</Typography>

      <Typography className="mt-3 flex items-center gap-1.5 text-xs text-muted">
        <PeopleAltRoundedIcon className="text-base" />
        {formatRecipients(recipientNames)}
      </Typography>
    </Paper>
  )
})
