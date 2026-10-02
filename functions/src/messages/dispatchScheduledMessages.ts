import * as logger from 'firebase-functions/logger'
import { onSchedule } from 'firebase-functions/scheduler'

import { DISPATCH_SCHEDULE, TIME_ZONE } from '../config'
import { getDb } from '../lib/firestore'
import { dispatchDueMessages } from './dispatchDueMessages'

export const dispatchScheduledMessages = onSchedule(
  { schedule: DISPATCH_SCHEDULE, timeZone: TIME_ZONE, retryCount: 0 },
  async () => {
    const { sent, skipped } = await dispatchDueMessages(getDb(), new Date())

    logger.info('Disparo de mensagens agendadas concluído', { sent, skipped })
  },
)
