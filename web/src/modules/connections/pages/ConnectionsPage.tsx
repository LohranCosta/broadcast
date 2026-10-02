import AddRoundedIcon from '@mui/icons-material/AddRounded'
import LinkRoundedIcon from '@mui/icons-material/LinkRounded'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import { useState } from 'react'

import { useCurrentUser } from '@modules/auth/hooks/useSession'
import { EmptyState } from '@shared/components/molecules/EmptyState'
import { PageHeader } from '@shared/components/molecules/PageHeader'
import { ConfirmDialog } from '@shared/components/organisms/ConfirmDialog'
import { useDialogState } from '@shared/hooks/useDialogState'
import { useNotify } from '@shared/hooks/useNotify'

import { ConnectionFormDialog } from '../components/ConnectionFormDialog'
import { ConnectionList } from '../components/ConnectionList'
import { useConnections } from '../hooks/useConnections'
import type { ConnectionInput } from '../schemas/connectionSchema'
import {
  createConnection,
  deleteConnection,
  updateConnection,
} from '../services/connectionsService'
import type { Connection } from '../types'

export function ConnectionsPage() {
  const { uid } = useCurrentUser()
  const { data: connections, loading, error } = useConnections()
  const formDialog = useDialogState<Connection>()
  const deleteDialog = useDialogState<Connection>()
  const [deleting, setDeleting] = useState(false)
  const notify = useNotify()

  const handleSubmit = async (values: ConnectionInput) => {
    const editing = formDialog.item

    try {
      if (editing) {
        await updateConnection(editing.id, values)
      } else {
        await createConnection(uid, values)
      }
      notify.success(editing ? 'Conexão atualizada' : 'Conexão criada')
      formDialog.close()
    } catch {
      notify.error('Não foi possível salvar a conexão')
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.item) return

    setDeleting(true)
    try {
      await deleteConnection(deleteDialog.item.id)
      notify.success('Conexão excluída')
      deleteDialog.close()
    } catch {
      notify.error('Não foi possível excluir a conexão')
    } finally {
      setDeleting(false)
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
        <ConnectionList
          connections={connections}
          loading={loading}
          onEdit={formDialog.open}
          onDelete={deleteDialog.open}
        />
      )}

      <ConnectionFormDialog
        open={formDialog.isOpen}
        connection={formDialog.item}
        onClose={formDialog.close}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={deleteDialog.isOpen}
        title="Excluir conexão"
        description={`A conexão "${deleteDialog.item?.name}" será excluída junto com todos os contatos e mensagens dela. Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        loading={deleting}
        onConfirm={handleDelete}
        onClose={deleteDialog.close}
      />
    </>
  )
}
