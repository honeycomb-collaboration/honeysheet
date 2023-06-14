import { resolveController } from './routes'
import type { Serve, Server } from 'bun'
import { websocket } from './websocket'

export default {
    port: 9898,
    fetch(request: Request, server: Server) {
        console.info(request.url)
        const controller = resolveController(request)
        return controller(request, server)
    },
    websocket,
} satisfies Serve
