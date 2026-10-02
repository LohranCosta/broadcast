import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import LinkRoundedIcon from '@mui/icons-material/LinkRounded'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { memo } from 'react'

import { formatDate } from '@shared/utils/formatDate'

import type { Connection } from '../types'

type ConnectionCardProps = {
  connection: Connection
  onEdit: (connection: Connection) => void
  onDelete: (connection: Connection) => void
}

export const ConnectionCard = memo(function ConnectionCard({
  connection,
  onEdit,
  onDelete,
}: ConnectionCardProps) {
  return (
    <Paper className="flex items-center gap-3 rounded-2xl border border-border p-5">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
        <LinkRoundedIcon />
      </span>
      <div className="min-w-0 flex-1">
        <Typography className="truncate font-semibold">{connection.name}</Typography>
        {connection.createdAt && (
          <Typography className="text-xs text-muted">
            Criada em {formatDate(connection.createdAt)}
          </Typography>
        )}
      </div>
      <div className="flex shrink-0">
        <Tooltip title="Editar">
          <IconButton size="small" aria-label="Editar" onClick={() => onEdit(connection)}>
            <EditRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Excluir">
          <IconButton size="small" aria-label="Excluir" onClick={() => onDelete(connection)}>
            <DeleteOutlineRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>
    </Paper>
  )
})
