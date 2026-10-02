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
  updateDoc,
  where,
} from 'firebase/firestore'
import { afterAll, afterEach, beforeAll, beforeEach, describe, it } from 'vitest'

import { createRulesEnvironment } from './environment'

describe('regras de contacts', () => {
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
      await setDoc(doc(db, 'contacts/bia-contact'), {
        clientId: 'bia',
        connectionId: 'bia-conn',
        name: 'Contato da Bia',
        phone: '11912345678',
        ...timestamps,
      })
    }),
  )

  afterEach(() => env.clearFirestore())

  afterAll(() => env.cleanup())

  const dbAs = (uid: string) => env.authenticatedContext(uid).firestore()

  const newContact = (clientId: string, connectionId: string, phone = '11912345678') => ({
    clientId,
    connectionId,
    name: 'João',
    phone,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  it('cria contato em uma conexão própria', async () => {
    await assertSucceeds(addDoc(collection(dbAs('ana'), 'contacts'), newContact('ana', 'ana-conn')))
  })

  it('não cria contato na conexão de outro cliente', async () => {
    await assertFails(addDoc(collection(dbAs('ana'), 'contacts'), newContact('ana', 'bia-conn')))
  })

  it('valida o telefone', async () => {
    const contacts = collection(dbAs('ana'), 'contacts')

    await assertFails(addDoc(contacts, newContact('ana', 'ana-conn', '(11) 91234-5678')))
    await assertFails(addDoc(contacts, newContact('ana', 'ana-conn', '12345')))
  })

  it('lista só os contatos do próprio cliente', async () => {
    const contacts = collection(dbAs('ana'), 'contacts')

    await assertSucceeds(
      getDocs(
        query(contacts, where('clientId', '==', 'ana'), where('connectionId', '==', 'ana-conn')),
      ),
    )
    await assertFails(getDocs(query(contacts, where('connectionId', '==', 'bia-conn'))))
  })

  it('não altera nem exclui contato de outro cliente', async () => {
    const contact = doc(dbAs('ana'), 'contacts/bia-contact')

    await assertFails(updateDoc(contact, { name: 'Invasão', updatedAt: serverTimestamp() }))
    await assertFails(deleteDoc(contact))
  })

  it('não permite mover o contato para outra conexão', async () => {
    const contact = doc(dbAs('bia'), 'contacts/bia-contact')

    await assertSucceeds(updateDoc(contact, { name: 'Novo nome', updatedAt: serverTimestamp() }))
    await assertFails(
      updateDoc(contact, { connectionId: 'ana-conn', updatedAt: serverTimestamp() }),
    )
  })
})
