import { workerWrap } from './sharedworker/wrap'
import type { ConnectionMessageHandler, IConnection } from './connection/connection'
import { Connection } from './connection/connection'

export { HEARTBEAT_MESSAGE } from './constant/constant'
export { workerWrap, Connection }
export type { IConnection, ConnectionMessageHandler }
