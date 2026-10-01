import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

export default function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Typography variant="h4" component="h1" className="font-semibold text-primary">
        Broadcast
      </Typography>
      <Button variant="contained">Começar</Button>
    </main>
  )
}
