import type { IConnection } from '@honeycomb-co/connection'
import { Destroyable } from '../tools'
import { getConnection } from './websocket'
import { ResponseWorkbook } from './ajax'

export class Server extends Destroyable {
    private readonly socketConnection: IConnection
    constructor(private readonly host: string) {
        super()
        this.socketConnection = getConnection(host)
    }

    public getWorkbook(id: string): Promise<ResponseWorkbook> {
        return fetch(`//${this.host}/api/v1/workbook/${id}`).then((res) => res.json())
    }
}