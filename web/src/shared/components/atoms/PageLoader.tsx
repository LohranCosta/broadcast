import CircularProgress from '@mui/material/CircularProgress'

export function PageLoader() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas">
      <CircularProgress aria-label="Carregando" />
    </div>
  )
}
