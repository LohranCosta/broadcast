import type { ReactNode } from 'react'

type AppLayoutProps = {
  header: ReactNode
  children: ReactNode
}

export function AppLayout({ header, children }: AppLayoutProps) {
  return (
    <div className="min-h-dvh bg-canvas">
      {header}
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  )
}
