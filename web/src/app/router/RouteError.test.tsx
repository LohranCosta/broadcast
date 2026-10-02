import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'

import { RouteError } from './RouteError'

describe('RouteError', () => {
  it('oferece uma saída quando a página não carrega', async () => {
    const router = createMemoryRouter([
      {
        path: '/',
        errorElement: <RouteError />,
        lazy: () => Promise.reject(new Error('Failed to fetch dynamically imported module')),
      },
    ])

    render(<RouterProvider router={router} />)

    expect(await screen.findByText('Não foi possível abrir esta página')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Recarregar' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ir para o início' })).toHaveAttribute('href', '/')
  })
})
