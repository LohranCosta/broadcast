import {
  onSnapshot,
  type DocumentData,
  type DocumentReference,
  type FirestoreDataConverter,
  type Query,
  type Timestamp,
} from 'firebase/firestore'

import type { Subscribable } from '@shared/types/observable'

export const fromQuery = <T>(query: Query<T>): Subscribable<T[]> => ({
  subscribe: (observer) => ({
    unsubscribe: onSnapshot(
      query,
      (snapshot) => observer.next(snapshot.docs.map((document) => document.data())),
      observer.error,
    ),
  }),
})

export const fromDocument = <T>(reference: DocumentReference<T>): Subscribable<T | null> => ({
  subscribe: (observer) => ({
    unsubscribe: onSnapshot(
      reference,
      (snapshot) => observer.next(snapshot.data() ?? null),
      observer.error,
    ),
  }),
})

export const toDate = (value: Timestamp | null | undefined) => value?.toDate() ?? null

export const createReadConverter = <T>(
  fromFirestore: (id: string, data: DocumentData) => T,
): FirestoreDataConverter<T, DocumentData> => ({
  toFirestore: (value) => value as DocumentData,
  fromFirestore: (snapshot, options) =>
    fromFirestore(snapshot.id, snapshot.data({ ...options, serverTimestamps: 'estimate' })),
})
