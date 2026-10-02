import {
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore'
import { afterAll, afterEach, beforeAll, describe, it } from 'vitest'

import { createRulesEnvironment } from './environment'

describe('regras de connections', () => {
  let env: RulesTestEnvironment

  beforeAll(async () => {
    env = await createRulesEnvironment()
  })

  afterEach(() => env.clearFirestore())

  afterAll(() => env.cleanup())

  const dbAs = (uid: string) => env.authenticatedContext(uid).firestore()

  const newConnection = (clientId: string, name = 'WhatsApp Vendas') => ({
    clientId,
    name,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  const seedConnection = (id: string, clientId: string) =>
    env.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'connections', id), {
        clientId,
        name: 'Conexão',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    })

  it('cria conexão para o próprio cliente', async () => {
    await assertSucceeds(addDoc(collection(dbAs('ana'), 'connections'), newConnection('ana')))
  })

  it('não cria conexão em nome de outro cliente', async () => {
    await assertFails(addDoc(collection(dbAs('ana'), 'connections'), newConnection('bia')))
  })

  it('valida o nome e os campos da conexão', async () => {
    const connections = collection(dbAs('ana'), 'connections')

    await assertFails(addDoc(connections, newConnection('ana', '')))
    await assertFails(addDoc(connections, newConnection('ana', 'x'.repeat(61))))
    await assertFails(addDoc(connections, { ...newConnection('ana'), extra: true }))
    await assertFails(addDoc(connections, { ...newConnection('ana'), createdAt: new Date(0) }))
  })

  it('lista apenas as conexões do próprio cliente', async () => {
    await seedConnection('c1', 'ana')
    await seedConnection('c2', 'bia')
    const connections = collection(dbAs('ana'), 'connections')

    await assertSucceeds(getDocs(query(connections, where('clientId', '==', 'ana'))))
    await assertFails(getDocs(query(connections, where('clientId', '==', 'bia'))))
    await assertFails(getDocs(connections))
  })

  it('não lê conexão de outro cliente', async () => {
    await seedConnection('c2', 'bia')

    await assertFails(getDoc(doc(dbAs('ana'), 'connections/c2')))
    await assertFails(getDoc(doc(env.unauthenticatedContext().firestore(), 'connections/c2')))
  })
})
