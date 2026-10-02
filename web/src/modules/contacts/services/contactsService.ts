import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'

import { COLLECTIONS } from '@lib/collections'
import { db } from '@lib/firebase'
import { createReadConverter, fromQuery, toDate } from '@lib/firestore'

import type { ContactInput } from '../schemas/contactSchema'
import type { Contact } from '../types'

const contacts = collection(db, COLLECTIONS.contacts)

const contactConverter = createReadConverter<Contact>((id, data) => ({
  id,
  connectionId: data.connectionId,
  name: data.name,
  phone: data.phone,
  createdAt: toDate(data.createdAt),
}))

export const observeContacts = (clientId: string, connectionId: string) =>
  fromQuery(
    query(
      contacts.withConverter(contactConverter),
      where('clientId', '==', clientId),
      where('connectionId', '==', connectionId),
      orderBy('name'),
    ),
  )

export const createContact = (
  clientId: string,
  connectionId: string,
  { name, phone }: ContactInput,
) =>
  addDoc(contacts, {
    clientId,
    connectionId,
    name,
    phone,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

export const updateContact = (contactId: string, { name, phone }: ContactInput) =>
  updateDoc(doc(contacts, contactId), { name, phone, updatedAt: serverTimestamp() })

export const deleteContact = (contactId: string) => deleteDoc(doc(contacts, contactId))
