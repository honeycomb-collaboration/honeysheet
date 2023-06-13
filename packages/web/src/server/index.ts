import type { IConnection } from '@honeysheet/connection'
import { Destroyable } from '../tools'
import { getConnection } from './websocket'
import { Action } from '../core/action/action'
import { CellRecordDTO, SheetDTO, SheetId, WorkbookDTO } from '@honeysheet/shared'

export class Server extends Destroyable {
    private readonly socketConnection: IConnection
    constructor(private readonly host: string) {
        super()
        this.socketConnection = getConnection(host)
    }

    public sendAction(action: Action): void {
        this.socketConnection.send(JSON.stringify(action))
    }

    public getWorkbook(id: string): Promise<WorkbookDTO> {
        return fetch(`//${this.host}/api/v1/workbook/${id}`).then((res) => res.json())
    }

    public getWorkbookSheets(id: string): Promise<SheetDTO[]> {
        return fetch(`//${this.host}/api/v1/workbook/${id}/sheet`).then((res) => res.json())
    }

    public getSheetCells(id: SheetId): Promise<CellRecordDTO[]> {
        return fetch(`//${this.host}/api/v1/sheet/${id}/cell`).then((res) => res.json())
    }
}
