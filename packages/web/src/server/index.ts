import type { IConnection } from '@honeysheet/connection'
import { Destroyable } from '../tools'
import { getConnection } from './websocket'
import { ResponseSheet, ResponseWorkbook } from './ajax'
import { CellRecord } from '../core/cell'
import { SheetId } from '../core/sheet'
import { Action } from '../core/action/action'

export class Server extends Destroyable {
    private readonly socketConnection: IConnection
    constructor(private readonly host: string) {
        super()
        this.socketConnection = getConnection(host)
    }

    public sendAction(action: Action): void {
        this.socketConnection.send(JSON.stringify(action))
    }

    public getWorkbook(id: string): Promise<ResponseWorkbook> {
        return fetch(`//${this.host}/api/v1/workbook/${id}`).then((res) => res.json())
    }

    public getWorkbookSheets(id: string): Promise<ResponseSheet[]> {
        return fetch(`//${this.host}/api/v1/workbook/${id}/sheet`).then((res) => res.json())
    }

    public getSheetCells(id: SheetId): Promise<CellRecord[]> {
        return fetch(`//${this.host}/api/v1/sheet/${id}/cell`).then((res) => res.json())
    }
}