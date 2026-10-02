import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'
import Chip from '@mui/material/Chip'
import type { ReactElement } from 'react'

import type { MessageStatus } from '../types'

const STATUS = {
  sent: {
    label: 'Enviada',
    icon: <DoneAllRoundedIcon />,
    className: 'bg-primary-light text-primary-dark [&_.MuiChip-icon]:text-primary',
  },
  scheduled: {
    label: 'Agendada',
    icon: <ScheduleRoundedIcon />,
    className: 'bg-amber-50 text-amber-800 [&_.MuiChip-icon]:text-amber-600',
  },
} satisfies Record<MessageStatus, { label: string; icon: ReactElement; className: string }>

export function MessageStatusChip({ status }: { status: MessageStatus }) {
  const { label, icon, className } = STATUS[status]

  return <Chip size="small" label={label} icon={icon} className={`font-medium ${className}`} />
}
