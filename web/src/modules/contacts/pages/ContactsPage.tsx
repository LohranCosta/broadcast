import ContactsRoundedIcon from '@mui/icons-material/ContactsRounded'
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useParams } from 'react-router'

import { useCurrentUser } from '@modules/auth/hooks/useSession'
import { EmptyState } from '@shared/components/molecules/EmptyState'
import { ConfirmDialog } from '@shared/components/organisms/ConfirmDialog'
import { useDialogState } from '@shared/hooks/useDialogState'
import { useNotify } from '@shared/hooks/useNotify'

import { ContactFormDialog } from '../components/ContactFormDialog'
import { ContactList } from '../components/ContactList'
import { useContacts } from '../hooks/useContacts'
import type { ContactInput } from '../schemas/contactSchema'
import { createContact, deleteContact, updateContact } from '../services/contactsService'
import type { Contact } from '../types'

export function ContactsPage() {
  const { connectionId = '' } = useParams()
  const { uid } = useCurrentUser()
  const { data: contacts, loading, error } = useContacts(connectionId)
  const formDialog = useDialogState<Contact>()
  const deleteDialog = useDialogState<Contact>()
  const [deleting, setDeleting] = useState(false)
  const notify = useNotify()

  const handleSubmit = async (values: ContactInput) => {
    const editing = formDialog.item

    try {
      if (editing) {
        await updateContact(editing.id, values)
      } else {
        await createContact(uid, connectionId, values)
      }
      notify.success(editing ? 'Contato atualizado' : 'Contato adicionado')
      formDialog.close()
    } catch {
      notify.error('Não foi possível salvar o contato')
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.item) return

    setDeleting(true)
    try {
      await deleteContact(deleteDialog.item.id)
      notify.success('Contato excluído')
      deleteDialog.close()
    } catch {
      notify.error('Não foi possível excluir o contato')
    } finally {
      setDeleting(false)
    }
  }

  const isEmpty = !loading && !error && contacts.length === 0

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Typography className="text-sm text-muted">
          {loading ? 'Carregando contatos...' : `${contacts.length} contato(s)`}
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddAlt1RoundedIcon />}
          onClick={() => formDialog.open()}
        >
          Novo contato
        </Button>
      </div>

      {error && (
        <Alert severity="error" className="mb-4">
          Não foi possível carregar os contatos.
        </Alert>
      )}

      {isEmpty ? (
        <EmptyState
          icon={<ContactsRoundedIcon />}
          title="Nenhum contato nesta conexão"
          description="Adicione os contatos que vão receber as mensagens desta conexão."
        />
      ) : (
        <ContactList
          contacts={contacts}
          loading={loading}
          onEdit={formDialog.open}
          onDelete={deleteDialog.open}
        />
      )}

      <ContactFormDialog
        open={formDialog.isOpen}
        contact={formDialog.item}
        onClose={formDialog.close}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={deleteDialog.isOpen}
        title="Excluir contato"
        description={`O contato "${deleteDialog.item?.name}" será removido desta conexão.`}
        confirmLabel="Excluir"
        loading={deleting}
        onConfirm={handleDelete}
        onClose={deleteDialog.close}
      />
    </>
  )
}
