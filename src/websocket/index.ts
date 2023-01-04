import { workerWrap } from '@honeycomb-co/connection'
import workerUrl from '@honeycomb-co/connection/sharedworker?url'
function bufferToString(buffer: BufferSource): Promise<string> {
    const blob = new Blob([buffer], {
        type: 'application/json; charset=utf-8',
    })
    return blob.text()
}
export function getConnection(serverHost: string) {
    const websocketUrl = `ws://${serverHost}/v1/spreadsheets/ws`
    const Socket = workerWrap(workerUrl)
    const soc = new Socket(websocketUrl, (message: ArrayBuffer) => {
        bufferToString(message).then((message) => {
            console.info(`${new Date().toLocaleTimeString()}\t${message}`)
        })
    })

    function sayHello() {
        const dtf = new Intl.DateTimeFormat('zh-CN', { dateStyle: 'short', timeStyle: 'medium' })
        soc.send(`hello, server! ${dtf.format(new Date())}`)
        setTimeout(sayHello, 2000)
    }

    setTimeout(sayHello, 2000)
}
