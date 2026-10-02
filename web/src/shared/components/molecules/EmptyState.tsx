import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'

type EmptyStateProps = {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-surface px-6 py-14 text-center">
      <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary-light text-primary">
        {icon}
      </span>
      <Typography className="font-semibold">{title}</Typography>
      <Typography className="mt-1 max-w-sm text-sm text-muted">{description}</Typography>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
