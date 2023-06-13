import { resolveController } from './routes'
import type { Serve, Server, ServerWebSocket } from 'bun'

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
            console.log(message.toString())
            ws.send('')
        },
    },
} satisfies Serve
