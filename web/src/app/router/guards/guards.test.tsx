import { render, screen } from '@testing-library/react'
import { createStore, Provider } from 'jotai'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import { sessionAtom } from '@modules/auth/store/session'
import type { Session } from '@modules/auth/types'
import { ROUTES } from '@shared/constants/routes'

import { PrivateRoute } from './PrivateRoute'
import { PublicOnlyRoute } from './PublicOnlyRoute'

vi.mock('@modules/auth/services/authService', () => ({
  observeAuthState: vi.fn(() => () => {}),
}))

const authenticated: Session = {
  status: 'authenticated',
  user: { uid: 'client-1', email: 'ana@email.com', name: 'Ana' },
}

function renderAt(path: string, session: Session) {
  const store = createStore()
  store.set(sessionAtom, session)

  const router = createMemoryRouter(
    [
      {
        element: <PublicOnlyRoute />,
        children: [{ path: ROUTES.login, element: <p>tela de login</p> }],
      },
      {
        element: <PrivateRoute />,
        children: [{ path: ROUTES.home, element: <p>área logada</p> }],
      },
    ],
    { initialEntries: [path] },
  )

  render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>,
  )
}

describe('guards de rota', () => {
  it('mostra o loader enquanto a sessão carrega', () => {
    renderAt(ROUTES.home, { status: 'loading' })

    expect(screen.getByLabelText('Carregando')).toBeInTheDocument()
  })

  it('manda para o login quem não está autenticado', async () => {
    renderAt(ROUTES.home, { status: 'unauthenticated' })

    expect(await screen.findByText('tela de login')).toBeInTheDocument()
  })

  it('libera a área logada para quem está autenticado', async () => {
    renderAt(ROUTES.home, authenticated)

    expect(await screen.findByText('área logada')).toBeInTheDocument()
  })

  it('tira o usuário autenticado das telas públicas', async () => {
    renderAt(ROUTES.login, authenticated)

    expect(await screen.findByText('área logada')).toBeInTheDocument()
  })
})
