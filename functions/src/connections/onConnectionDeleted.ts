import { onDocumentDeleted } from 'firebase-functions/firestore'
import * as logger from 'firebase-functions/logger'

import { COLLECTIONS } from '../config'
import { getDb, readString } from '../lib/firestore'
import { deleteConnectionData } from './deleteConnectionData'

export const onConnectionDeleted = onDocumentDeleted(
  `${COLLECTIONS.connections}/{connectionId}`,
  async ({ data, params: { connectionId } }) => {
    const clientId = readString(data, 'clientId')

    if (!clientId) {
      logger.warn('Conexão excluída sem clientId; nada foi apagado', { connectionId })
      return
    }

    const summary = await deleteConnectionData(getDb(), { connectionId, clientId })

    logger.info('Dados da conexão excluída apagados', { connectionId, clientId, ...summary })
  },
)
