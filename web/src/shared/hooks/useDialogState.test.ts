import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useDialogState } from './useDialogState'

describe('useDialogState', () => {
  it('abre sem item para criação', () => {
    const { result } = renderHook(() => useDialogState<{ id: string }>())

    act(() => result.current.open())

    expect(result.current.isOpen).toBe(true)
    expect(result.current.item).toBeNull()
  })

  it('abre com o item selecionado para edição', () => {
    const { result } = renderHook(() => useDialogState<{ id: string }>())

    act(() => result.current.open({ id: '1' }))

    expect(result.current.item).toEqual({ id: '1' })
  })

  it('mantém o item ao fechar para não piscar a animação de saída', () => {
    const { result } = renderHook(() => useDialogState<{ id: string }>())

    act(() => result.current.open({ id: '1' }))
    act(() => result.current.close())

    expect(result.current.isOpen).toBe(false)
    expect(result.current.item).toEqual({ id: '1' })
  })
})
