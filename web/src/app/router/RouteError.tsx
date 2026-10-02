import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import Button from '@mui/material/Button'

import { Logo } from '@shared/components/atoms/Logo'
import { EmptyState } from '@shared/components/molecules/EmptyState'
import { ROUTES } from '@shared/constants/routes'

export function RouteError() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-canvas px-4 py-10">
      <div className="w-full max-w-md">
        <Logo className="mb-8 justify-center" />
        <EmptyState
          icon={<RefreshRoundedIcon />}
          title="Não foi possível abrir esta página"
          description="Pode ser que uma versão nova do app tenha sido publicada. Recarregue para continuar."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="contained" onClick={() => window.location.reload()}>
                Recarregar
              </Button>
              <Button href={ROUTES.home}>Ir para o início</Button>
            </div>
          }
        />
      </div>
    </main>
  )
}
