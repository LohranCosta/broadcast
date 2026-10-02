import AddRoundedIcon from '@mui/icons-material/AddRounded'
import LinkRoundedIcon from '@mui/icons-material/LinkRounded'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'

import { useCurrentUser } from '@modules/auth/hooks/useSession'
import { EmptyState } from '@shared/components/molecules/EmptyState'
import { PageHeader } from '@shared/components/molecules/PageHeader'
import { useDialogState } from '@shared/hooks/useDialogState'
import { useNotify } from '@shared/hooks/useNotify'

import { ConnectionFormDialog } from '../components/ConnectionFormDialog'
import { ConnectionList } from '../components/ConnectionList'
import { useConnections } from '../hooks/useConnections'
import type { ConnectionInput } from '../schemas/connectionSchema'
import { createConnection } from '../services/connectionsService'
import type { Connection } from '../types'

export function ConnectionsPage() {
  const { uid } = useCurrentUser()
  const { data: connections, loading, error } = useConnections()
  const formDialog = useDialogState<Connection>()
  const notify = useNotify()

  const handleSubmit = async (values: ConnectionInput) => {
    try {
      await createConnection(uid, values)
      notify.success('Conexão criada')
      formDialog.close()
    } catch {
      notify.error('Não foi possível salvar a conexão')
    }
  }

  const isEmpty = !loading && !error && connections.length === 0

  return (
    <>
      <PageHeader
        title="Conexões"
        description="Gerencie as conexões usadas para enviar suas mensagens."
        action={
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => formDialog.open()}
          >
            Nova conexão
          </Button>
        }
      />

      {error && (
        <Alert severity="error" className="mb-4">
          Não foi possível carregar suas conexões.
        </Alert>
      )}

      {isEmpty ? (
        <EmptyState
          icon={<LinkRoundedIcon />}
          title="Nenhuma conexão ainda"
          description="Crie sua primeira conexão para cadastrar contatos e começar a enviar mensagens."
        />
      ) : (
        <ConnectionList connections={connections} loading={loading} />
      )}

      <ConnectionFormDialog
        open={formDialog.isOpen}
        connection={formDialog.item}
        onClose={formDialog.close}
        onSubmit={handleSubmit}
      />
    </>
  )
}
