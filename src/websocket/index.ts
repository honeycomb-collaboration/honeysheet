import { workerWrap } from '@honeycomb-co/connection'
import workerUrl from '@honeycomb-co/connection/sharedworker?url'

export function getConnection(wsUrl: string) {
    const Socket = workerWrap(workerUrl)
    const soc = new Socket(wsUrl, (message: unknown) => {
        console.info(`${new Date().toLocaleTimeString()}\t${message}`)
    })

    function sayHello() {
        const dtf = new Intl.DateTimeFormat('zh-CN', { dateStyle: 'short', timeStyle: 'medium' })
        soc.send(`hello, server! ${dtf.format(new Date())}`)
        setTimeout(sayHello, 2000)
    }

    setTimeout(sayHello, 2000)
}
