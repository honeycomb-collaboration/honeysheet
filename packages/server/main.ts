import { resolveController } from './routes'
import { type Serve } from 'bun'

export default {
    port: 9898,
    fetch(request: Request) {
        console.info(request.url)
        const controller = resolveController(request)
        return controller(request)
    },
} satisfies Serve
