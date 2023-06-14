import { resolveController } from './routes'
import type { Serve, Server, ServerWebSocket } from 'bun'
import { HEARTBEAT_MESSAGE } from '@honeysheet/connection'

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
            }
            console.log(message)
        },
    },
} satisfies Serve
