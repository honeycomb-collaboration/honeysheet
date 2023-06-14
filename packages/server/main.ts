import { resolveController } from './routes'
import type { Serve, Server, ServerWebSocket } from 'bun'
import { HEARTBEAT_MESSAGE } from '@honeysheet/connection'
import { Action } from '@honeysheet/shared'
import { handleAction } from './controller'

export default {
    port: 9898,
    fetch(request: Request, server: Server) {
        console.info(request.url)
        const controller = resolveController(request)
        return controller(request, server)
    },
    websocket: {
        perMessageDeflate: true,
        message(ws: ServerWebSocket, message: string | Uint8Array) {
            if (message === HEARTBEAT_MESSAGE.PING) {
                ws.send(HEARTBEAT_MESSAGE.PONG)
                return
            }
            try {
                const action = JSON.parse(message as string) satisfies Action
                const resultAction = handleAction(ws, action)
                ws.send(JSON.stringify(resultAction))
                return
            } catch (error) {
                console.error('not a valid action', error)
            }
            console.log(message)
        },
    },
} satisfies Serve
