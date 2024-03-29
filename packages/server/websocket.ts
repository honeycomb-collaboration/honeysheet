import { Server, WebSocketHandler } from 'bun'
import { HEARTBEAT_MESSAGE } from '@honeysheet/connection'
import { Action } from '@honeysheet/shared'
import { handleAction } from './controller'

const topic = 'honeysheet'
type ContextData = undefined

export function UpgradeWebSocketController(request: Request, server: Server) {
    if (server.upgrade(request)) {
        return
    }
    return new Response('Upgrade failed :(', { status: 500 })
}

export const websocket: WebSocketHandler<ContextData> = {
    perMessageDeflate: true,
    open(ws) {
        console.debug('websocket opened from', ws.remoteAddress)
        ws.subscribe(topic)
    },
    close(ws, code, message) {
        console.debug('websocket closed with', ws.remoteAddress, { code, message })
        ws.unsubscribe(topic)
    },
    message(ws, message: string | Uint8Array) {
        if (message === HEARTBEAT_MESSAGE.PING) {
            ws.send(HEARTBEAT_MESSAGE.PONG)
            return
        }
        try {
            const action = JSON.parse(message as string) satisfies Action
            const [res, brod] = handleAction(ws, action)
            console.log(message, res, brod)
            ws.publish(topic, JSON.stringify(brod))
            ws.sendText(JSON.stringify(res))
            return
        } catch (error) {
            console.error('not a valid action', error)
        }
    },
}
