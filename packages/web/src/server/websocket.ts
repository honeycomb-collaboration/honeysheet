import { IConnection, workerWrap } from '@honeysheet/connection'
import workerUrl from '@honeysheet/connection/sharedworker?url'

export function getConnection(serverHost: string): IConnection {
    const websocketUrl = `ws://${serverHost}/api/v1/ws`
    const ConnectionInsideWorker = workerWrap(workerUrl)
    const connection: IConnection = new ConnectionInsideWorker(websocketUrl, (message: string) => {
        console.info(`${new Date().toLocaleTimeString()}\t${message}`)
    })

    // function sayHello() {
    //     const dtf = new Intl.DateTimeFormat('zh-CN', { dateStyle: 'short', timeStyle: 'medium' })
    //     connection.send(`hello, server! ${dtf.format(new Date())}`)
    //     setTimeout(sayHello, 2000)
    // }
    //
    // setTimeout(sayHello, 2000)

    return connection
}
