import Skeleton from '@mui/material/Skeleton'

import type { Connection } from '../types'
import { ConnectionCard } from './ConnectionCard'

type ConnectionListProps = {
  connections: Connection[]
  loading: boolean
  onEdit: (connection: Connection) => void
  onDelete: (connection: Connection) => void
}

const GRID = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'

export function ConnectionList({ connections, loading, onEdit, onDelete }: ConnectionListProps) {
  if (loading) {
    return (
      <div className={GRID} aria-busy="true">
        {[0, 1, 2].map((item) => (
          <Skeleton key={item} variant="rounded" height={82} className="rounded-2xl" />
        ))}
      </div>
    )
  }

  return (
    <div className={GRID}>
      {connections.map((connection) => (
        <ConnectionCard
          key={connection.id}
          connection={connection}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
