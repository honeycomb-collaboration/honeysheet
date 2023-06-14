import type { IConnection } from '@honeysheet/connection'
import { Destroyable } from '../tools'
import { getConnection } from './websocket'
import { Action, CellRecordDTO, SheetDTO, SheetId, WorkbookDTO } from '@honeysheet/shared'

type ActionHandler = (action: Action) => unknown

export class Server extends Destroyable {
    private readonly socketConnection: IConnection
    private readonly actionHandlers = new Set<ActionHandler>()
    constructor(private readonly host: string) {
        super()
        this.socketConnection = getConnection(host, (action) => {
            this.actionHandlers.forEach((ah) => ah(action))
        })
    }

    public sendAction(action: Action): void {
        this.socketConnection.send(JSON.stringify(action))
    }

    public onAction(actionHandler: (action: Action) => unknown): () => void {
        this.actionHandlers.add(actionHandler)
        return () => {
            this.actionHandlers.delete(actionHandler)
        }
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
