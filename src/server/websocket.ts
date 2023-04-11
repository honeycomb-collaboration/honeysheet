import { IConnection, workerWrap } from '@honeycomb-co/connection'
import workerUrl from '@honeycomb-co/connection/sharedworker?url'

function bufferToString(buffer: BufferSource): Promise<string> {
    const blob = new Blob([buffer], {
        type: 'application/json; charset=utf-8',
    })
    return blob.text()
}

export function getConnection(serverHost: string): IConnection {
    const websocketUrl = `ws://${serverHost}/v1/spreadsheets/ws`
    const ConnectionInsideWorker = workerWrap(workerUrl)
    const connection: IConnection = new ConnectionInsideWorker(
        websocketUrl,
        (message: ArrayBuffer) => {
            bufferToString(message).then((message) => {
                console.info(`${new Date().toLocaleTimeString()}\t${message}`)
            })
        },
    )

    // function sayHello() {
    //     const dtf = new Intl.DateTimeFormat('zh-CN', { dateStyle: 'short', timeStyle: 'medium' })
    //     connection.send(`hello, server! ${dtf.format(new Date())}`)
    //     setTimeout(sayHello, 2000)
    // }
    //
    // setTimeout(sayHello, 2000)

    return connection
}
