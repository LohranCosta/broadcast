import Paper from '@mui/material/Paper'
import type { ReactNode } from 'react'

import { Logo } from '../atoms/Logo'

type AuthLayoutProps = {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-canvas px-4 py-10">
      <div className="w-full max-w-sm">
        <Logo className="mb-8 justify-center" />
        <Paper className="rounded-2xl border border-border p-6 sm:p-8">{children}</Paper>
      </div>
    </main>
  )
}
