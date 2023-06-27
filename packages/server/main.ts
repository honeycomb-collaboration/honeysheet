import { resolveController } from './routes'
import type { Serve, Server } from 'bun'
import { websocket } from './websocket'

export default {
    port: 9898,
    // @ts-expect-error may return void
    fetch(request: Request, server: Server) {
        const controller = resolveController(request)
        return controller(request, server)
    },
    websocket,
} satisfies Serve
