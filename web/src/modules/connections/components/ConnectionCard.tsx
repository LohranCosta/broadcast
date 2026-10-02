import LinkRoundedIcon from '@mui/icons-material/LinkRounded'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { memo } from 'react'

import { formatDate } from '@shared/utils/formatDate'

import type { Connection } from '../types'

type ConnectionCardProps = {
  connection: Connection
}

export const ConnectionCard = memo(function ConnectionCard({ connection }: ConnectionCardProps) {
  return (
    <Paper className="flex items-center gap-3 rounded-2xl border border-border p-5">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
        <LinkRoundedIcon />
      </span>
      <div className="min-w-0">
        <Typography className="truncate font-semibold">{connection.name}</Typography>
        {connection.createdAt && (
          <Typography className="text-xs text-muted">
            Criada em {formatDate(connection.createdAt)}
          </Typography>
        )}
      </div>
    </Paper>
  )
})
