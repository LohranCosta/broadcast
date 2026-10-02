import { useCallback, useState } from 'react'

type DialogState<T> = {
  isOpen: boolean
  item: T | null
}

export function useDialogState<T = never>() {
  const [state, setState] = useState<DialogState<T>>({ isOpen: false, item: null })

  const open = useCallback((item: T | null = null) => setState({ isOpen: true, item }), [])
  const close = useCallback(() => setState((current) => ({ ...current, isOpen: false })), [])

  return { ...state, open, close }
}
