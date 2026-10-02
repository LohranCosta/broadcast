import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import type { FormEventHandler, ReactNode } from 'react'

type FormDialogProps = {
  open: boolean
  title: string
  submitLabel: string
  submitting?: boolean
  maxWidth?: 'xs' | 'sm' | 'md'
  onClose: () => void
  onSubmit: FormEventHandler<HTMLFormElement>
  children: ReactNode
}

export function FormDialog({
  open,
  title,
  submitLabel,
  submitting = false,
  maxWidth = 'xs',
  onClose,
  onSubmit,
  children,
}: FormDialogProps) {
  return (
    <Dialog open={open} onClose={submitting ? undefined : onClose} fullWidth maxWidth={maxWidth}>
      <form onSubmit={onSubmit} noValidate>
        <DialogTitle className="font-semibold">{title}</DialogTitle>
        <DialogContent className="flex flex-col gap-4 pt-2">{children}</DialogContent>
        <DialogActions className="px-6 pb-5">
          <Button color="inherit" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" loading={submitting}>
            {submitLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
