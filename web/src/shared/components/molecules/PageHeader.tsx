import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'

type PageHeaderProps = {
  title: string
  description?: string
  action?: ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <Typography variant="h5" component="h1" className="font-semibold">
          {title}
        </Typography>
        {description && <Typography className="mt-1 text-sm text-muted">{description}</Typography>}
      </div>
      {action}
    </div>
  )
}
