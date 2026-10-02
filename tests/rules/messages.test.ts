import {
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { afterAll, afterEach, beforeAll, beforeEach, describe, it } from 'vitest'

import { createRulesEnvironment } from './environment'

const inOneHour = () => Timestamp.fromMillis(Date.now() + 60 * 60 * 1000)

describe('regras de messages', () => {
  let env: RulesTestEnvironment

  beforeAll(async () => {
    env = await createRulesEnvironment()
  })

  beforeEach(() =>
    env.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore()
      const timestamps = { createdAt: new Date(), updatedAt: new Date() }

      await setDoc(doc(db, 'connections/ana-conn'), { clientId: 'ana', name: 'Ana', ...timestamps })
      await setDoc(doc(db, 'connections/bia-conn'), { clientId: 'bia', name: 'Bia', ...timestamps })
      await setDoc(doc(db, 'messages/ana-msg'), {
        clientId: 'ana',
        connectionId: 'ana-conn',
        contactIds: ['c1'],
        content: 'Oi',
        status: 'scheduled',
        scheduledAt: inOneHour(),
        sentAt: null,
        ...timestamps,
      })
      await setDoc(doc(db, 'messages/bia-msg'), {
        clientId: 'bia',
        connectionId: 'bia-conn',
        contactIds: ['c2'],
        content: 'Oi',
        status: 'sent',
        scheduledAt: null,
        sentAt: new Date(),
        ...timestamps,
      })
    }),
  )

  afterEach(() => env.clearFirestore())

  afterAll(() => env.cleanup())

  const dbAs = (uid: string) => env.authenticatedContext(uid).firestore()

  const message = (overrides: Record<string, unknown> = {}) => ({
    clientId: 'ana',
    connectionId: 'ana-conn',
    contactIds: ['c1', 'c2'],
    content: 'Promoção de hoje!',
    status: 'sent',
    scheduledAt: null,
    sentAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...overrides,
  })

  const scheduled = (overrides: Record<string, unknown> = {}) =>
    message({ status: 'scheduled', scheduledAt: inOneHour(), sentAt: null, ...overrides })

  it('envia mensagem imediata e agenda para o futuro', async () => {
    const messages = collection(dbAs('ana'), 'messages')

    await assertSucceeds(addDoc(messages, message()))
    await assertSucceeds(addDoc(messages, scheduled()))
  })

  it('não agenda mensagem no passado', async () => {
    const past = Timestamp.fromMillis(Date.now() - 60 * 1000)

    await assertFails(addDoc(collection(dbAs('ana'), 'messages'), scheduled({ scheduledAt: past })))
  })

  it('não aceita status inválido nem sentAt forjado', async () => {
    const messages = collection(dbAs('ana'), 'messages')

    await assertFails(addDoc(messages, message({ status: 'delivered' })))
    await assertFails(addDoc(messages, message({ sentAt: Timestamp.fromMillis(0) })))
    await assertFails(addDoc(messages, scheduled({ sentAt: serverTimestamp() })))
  })

  it('exige contatos e conteúdo', async () => {
    const messages = collection(dbAs('ana'), 'messages')

    await assertFails(addDoc(messages, message({ contactIds: [] })))
    await assertFails(addDoc(messages, message({ content: '' })))
    await assertFails(addDoc(messages, message({ content: 'x'.repeat(1001) })))
  })

  it('não cria mensagem em conexão de outro cliente', async () => {
    await assertFails(
      addDoc(collection(dbAs('ana'), 'messages'), message({ connectionId: 'bia-conn' })),
    )
  })

  it('lista só as mensagens do próprio cliente', async () => {
    const messages = collection(dbAs('ana'), 'messages')

    await assertSucceeds(
      getDocs(
        query(
          messages,
          where('clientId', '==', 'ana'),
          where('connectionId', '==', 'ana-conn'),
          where('status', '==', 'scheduled'),
        ),
      ),
    )
    await assertFails(getDocs(query(messages, where('connectionId', '==', 'bia-conn'))))
  })

  it('edita a própria mensagem mantendo conexão e cliente', async () => {
    const own = doc(dbAs('ana'), 'messages/ana-msg')

    await assertSucceeds(
      updateDoc(own, {
        content: 'Novo texto',
        status: 'sent',
        scheduledAt: null,
        sentAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }),
    )
    await assertFails(updateDoc(own, { connectionId: 'bia-conn', updatedAt: serverTimestamp() }))
  })

  it('não edita nem exclui mensagem de outro cliente', async () => {
    const other = doc(dbAs('ana'), 'messages/bia-msg')

    await assertFails(updateDoc(other, { content: 'Invasão', updatedAt: serverTimestamp() }))
    await assertFails(deleteDoc(other))
    await assertSucceeds(deleteDoc(doc(dbAs('ana'), 'messages/ana-msg')))
  })
})
