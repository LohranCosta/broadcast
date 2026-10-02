import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { Observer, Subscribable } from '@shared/types/observable'

import { useObservable } from './useObservable'

function createSubject<T>() {
  const observers = new Set<Observer<T>>()
  const unsubscribe = vi.fn()

  const source: Subscribable<T> = {
    subscribe: (observer) => {
      observers.add(observer)
      return {
        unsubscribe: () => {
          observers.delete(observer)
          unsubscribe()
        },
      }
    },
  }

  return {
    source,
    unsubscribe,
    next: (value: T) => observers.forEach((observer) => observer.next(value)),
    error: (error: unknown) => observers.forEach((observer) => observer.error(error)),
  }
}

describe('useObservable', () => {
  it('começa carregando com o valor inicial', () => {
    const subject = createSubject<number[]>()
    const { result } = renderHook(() => useObservable(subject.source, []))

    expect(result.current).toEqual({ data: [], loading: true, error: null })
  })

  it('atualiza a cada valor emitido', () => {
    const subject = createSubject<number[]>()
    const { result } = renderHook(() => useObservable(subject.source, []))

    act(() => subject.next([1]))
    expect(result.current).toEqual({ data: [1], loading: false, error: null })

    act(() => subject.next([1, 2]))
    expect(result.current.data).toEqual([1, 2])
  })

  it('expõe o erro e para de carregar', () => {
    const subject = createSubject<number[]>()
    const { result } = renderHook(() => useObservable(subject.source, []))

    act(() => subject.error(new Error('sem permissão')))

    expect(result.current.loading).toBe(false)
    expect(result.current.error?.message).toBe('sem permissão')
  })

  it('cancela a inscrição ao desmontar', () => {
    const subject = createSubject<number[]>()
    const { unmount } = renderHook(() => useObservable(subject.source, []))

    unmount()

    expect(subject.unsubscribe).toHaveBeenCalled()
  })

  it('reinicia o estado quando a fonte muda', () => {
    const first = createSubject<string>()
    const second = createSubject<string>()
    const { result, rerender } = renderHook(({ source }) => useObservable(source, ''), {
      initialProps: { source: first.source },
    })

    act(() => first.next('primeira'))
    rerender({ source: second.source })

    expect(result.current).toEqual({ data: '', loading: true, error: null })
    expect(first.unsubscribe).toHaveBeenCalled()

    act(() => second.next('segunda'))
    expect(result.current.data).toBe('segunda')
  })

  it('não carrega nada quando não há fonte', () => {
    const { result } = renderHook(() => useObservable<string[]>(null, []))

    expect(result.current).toEqual({ data: [], loading: false, error: null })
  })
})
