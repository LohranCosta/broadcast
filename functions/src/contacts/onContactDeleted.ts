import { onDocumentDeleted } from 'firebase-functions/firestore'
import * as logger from 'firebase-functions/logger'

import { COLLECTIONS } from '../config'
import { getDb, readString } from '../lib/firestore'
import { removeContactFromMessages } from './removeContactFromMessages'

export const onContactDeleted = onDocumentDeleted(
  `${COLLECTIONS.contacts}/{contactId}`,
  async ({ data, params: { contactId } }) => {
    const clientId = readString(data, 'clientId')

    if (!clientId) {
      logger.warn('Contato excluído sem clientId; mensagens não foram alteradas', { contactId })
      return
    }

    const summary = await removeContactFromMessages(getDb(), { contactId, clientId })

    logger.info('Contato excluído removido das mensagens', { contactId, clientId, ...summary })
  },
)
