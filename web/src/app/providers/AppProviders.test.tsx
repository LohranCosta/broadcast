import Button from '@mui/material/Button'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AppProviders } from './AppProviders'

describe('AppProviders', () => {
  it('renderiza os filhos dentro dos providers', () => {
    render(
      <AppProviders>
        <Button variant="contained">Salvar</Button>
      </AppProviders>,
    )

    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument()
  })
})
