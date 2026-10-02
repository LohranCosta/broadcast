import { setGlobalOptions } from 'firebase-functions'

import { MAX_INSTANCES, REGION } from './config'

setGlobalOptions({ region: REGION, maxInstances: MAX_INSTANCES })

export { onConnectionDeleted } from './connections/onConnectionDeleted'
export { onContactDeleted } from './contacts/onContactDeleted'
export { dispatchScheduledMessages } from './messages/dispatchScheduledMessages'
