import {
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { afterAll, afterEach, beforeAll, describe, it } from 'vitest'

import { createRulesEnvironment } from './environment'

describe('regras de clients', () => {
  let env: RulesTestEnvironment

  beforeAll(async () => {
    env = await createRulesEnvironment()
  })

  afterEach(() => env.clearFirestore())

  afterAll(() => env.cleanup())

  const dbAs = (uid: string) =>
    env.authenticatedContext(uid, { email: `${uid}@email.com` }).firestore()

  const newClient = (uid: string) => ({
    name: 'Cliente Teste',
    email: `${uid}@email.com`,
    createdAt: serverTimestamp(),
  })

  it('permite criar o próprio cadastro de cliente', async () => {
    await assertSucceeds(setDoc(doc(dbAs('ana'), 'clients/ana'), newClient('ana')))
  })

  it('não permite criar cadastro com o uid de outra pessoa', async () => {
    await assertFails(setDoc(doc(dbAs('ana'), 'clients/bia'), newClient('bia')))
  })

  it('não aceita campos fora do esperado', async () => {
    await assertFails(
      setDoc(doc(dbAs('ana'), 'clients/ana'), { ...newClient('ana'), plan: 'premium' }),
    )
  })

  it('não aceita e-mail diferente do usuário autenticado', async () => {
    await assertFails(
      setDoc(doc(dbAs('ana'), 'clients/ana'), { ...newClient('ana'), email: 'outro@email.com' }),
    )
  })

  it('cada cliente só lê o próprio cadastro', async () => {
    await env.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'clients/bia'), newClient('bia'))
    })

    await assertSucceeds(getDoc(doc(dbAs('bia'), 'clients/bia')))
    await assertFails(getDoc(doc(dbAs('ana'), 'clients/bia')))
    await assertFails(getDoc(doc(env.unauthenticatedContext().firestore(), 'clients/bia')))
  })

  it('não permite alterar o cadastro depois de criado', async () => {
    await env.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'clients/ana'), newClient('ana'))
    })

    await assertFails(updateDoc(doc(dbAs('ana'), 'clients/ana'), { name: 'Outro nome' }))
  })
})
