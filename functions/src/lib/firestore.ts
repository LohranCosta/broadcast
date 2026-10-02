import { getApps, initializeApp } from 'firebase-admin/app'
import {
  getFirestore,
  GrpcStatus,
  type BulkWriter,
  type DocumentSnapshot,
  type Firestore,
  type Query,
  type QueryDocumentSnapshot,
} from 'firebase-admin/firestore'
import * as logger from 'firebase-functions/logger'

export const getDb = () => getFirestore(getApps().at(0) ?? initializeApp())

export const readString = (snapshot: DocumentSnapshot | undefined, field: string) => {
  const value: unknown = snapshot?.get(field)
  return typeof value === 'string' ? value : undefined
}

export const readStrings = (snapshot: DocumentSnapshot, field: string) => {
  const value: unknown = snapshot.get(field)
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : []
}

export const describeError = (error: unknown) => ({
  code: typeof error === 'object' && error !== null && 'code' in error ? error.code : undefined,
  reason: error instanceof Error ? error.message : String(error),
})

export async function* paginate(query: Query, pageSize: number) {
  let page = await query.limit(pageSize).get()

  while (!page.empty) {
    yield page.docs
    if (page.size < pageSize) return
    page = await query
      .startAfter(page.docs[page.size - 1])
      .limit(pageSize)
      .get()
  }
}

export const mapPages = async <T>(
  query: Query,
  pageSize: number,
  handlePage: (documents: QueryDocumentSnapshot[]) => Promise<T[]>,
) => {
  const results: T[] = []

  for await (const documents of paginate(query, pageSize)) {
    results.push(...(await handlePage(documents)))
  }

  return results
}

export const withBulkWriter = async <T>(
  db: Firestore,
  work: (writer: BulkWriter) => Promise<T>,
) => {
  const writer = db.bulkWriter()

  try {
    return await work(writer)
  } finally {
    await writer.close()
  }
}

const logWriteFailure = (document: QueryDocumentSnapshot, error: unknown) => {
  const { code, reason } = describeError(error)

  if (code === GrpcStatus.FAILED_PRECONDITION) {
    logger.info('Documento alterado depois da leitura; escrita descartada', {
      path: document.ref.path,
    })
    return
  }

  logger.error('Falha ao gravar documento', { path: document.ref.path, code, reason })
}

export const writeEach = async (
  writer: BulkWriter,
  documents: QueryDocumentSnapshot[],
  write: (writer: BulkWriter, document: QueryDocumentSnapshot) => Promise<unknown>,
) => {
  const outcomes = documents.map((document) =>
    write(writer, document).then(
      () => true,
      (error: unknown) => {
        logWriteFailure(document, error)
        return false
      },
    ),
  )

  await writer.flush()

  return Promise.all(outcomes)
}
