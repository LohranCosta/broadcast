import { useEffect, useState } from 'react'

import type { Subscribable } from '@shared/types/observable'

export type ObservableState<T> = {
  data: T
  loading: boolean
  error: Error | null
}

type InternalState<T> = ObservableState<T> & {
  source: Subscribable<T> | null
}

const toError = (error: unknown) => (error instanceof Error ? error : new Error(String(error)))

const initialState = <T>(source: Subscribable<T> | null, initialValue: T): InternalState<T> => ({
  source,
  data: initialValue,
  loading: source !== null,
  error: null,
})

export function useObservable<T>(
  source: Subscribable<T> | null,
  initialValue: T,
): ObservableState<T> {
  const [state, setState] = useState(() => initialState(source, initialValue))

  const current = state.source === source ? state : initialState(source, initialValue)

  if (state.source !== source) {
    setState(current)
  }

  useEffect(() => {
    if (!source) return

    const subscription = source.subscribe({
      next: (data) => setState({ source, data, loading: false, error: null }),
      error: (error) =>
        setState((previous) => ({ ...previous, source, loading: false, error: toError(error) })),
    })

    return () => subscription.unsubscribe()
  }, [source])

  return { data: current.data, loading: current.loading, error: current.error }
}
