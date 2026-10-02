import { atom } from 'jotai'

import type { MessageFilter } from '../types'

export const messageFilterAtom = atom<MessageFilter>('all')
