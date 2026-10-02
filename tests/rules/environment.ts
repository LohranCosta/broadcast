import { readFileSync } from 'node:fs'

import { initializeTestEnvironment } from '@firebase/rules-unit-testing'

export const createRulesEnvironment = () =>
  initializeTestEnvironment({
    projectId: 'demo-broadcast',
    firestore: { rules: readFileSync('firestore.rules', 'utf8') },
  })
