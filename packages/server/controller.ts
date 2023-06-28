import {
    Action,
    ActionBroadcast,
    ActionType,
    BROADCAST_HEAD,
    CellRecordDTO,
    RESPONSE_HEAD,
    SheetDTO,
    WorkbookDTO,
} from '@honeysheet/shared'
import type { Server, ServerWebSocket } from 'bun'
import { ActionResponse } from '@honeysheet/shared/action'
import { nanoid } from 'nanoid'

export type ControllerFunction = (request: Request, server: Server) => Response | void

const workbook: WorkbookDTO = {
    id: 'honeysheet_id',
    name: 'My Honeysheet',
    defaultColumnCount: 36, // 默认列数
    defaultRowCount: 36, // 默认行数
    defaultColumnWidth: 120, // 默认列宽
    defaultRowHeight: 40, // 默认行高
}

const sheets: SheetDTO[] = [
    {
        id: '1',
        name: 'Sheet 1',
        columnIds: [0, 1, 2, 3, 4],
        rowIds: [0, 1, 2, 3, 4],
    },
]

const cells: CellRecordDTO[] = [
    {
        columnId: 0,
        rowId: 0,
        cell: { v: 'R0_C0' },
    },
]

export function GetWorkbook(request: Request) {
    return new Response(JSON.stringify(workbook), {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Content-Type': 'application/json; charset=utf-8',
        },
    })
}

export function GetWorkbookSheets(request: Request) {
    return new Response(JSON.stringify(sheets), {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Content-Type': 'application/json; charset=utf-8',
        },
    })
}

export function GetSheet(request: Request) {
    //
}

export function GetSheetCells(request: Request) {
    return new Response(JSON.stringify(cells), {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Content-Type': 'application/json; charset=utf-8',
        },
    })
}

export function GetCell(request: Request) {
    //
}

export function handleAction(
    ws: ServerWebSocket,
    action: Action,
): [ActionResponse, ActionBroadcast] {
    switch (action.type) {
        case ActionType.UPDATE_CELL_V: {
            cells[0].cell.v = action.v
            return [
                [RESPONSE_HEAD, { type: ActionType.UPDATE_CELL_V, ok: true }],
                [BROADCAST_HEAD, action],
            ]
        }
        case ActionType.OPEN: {
            // TODO
            const sessionId = nanoid()
            return [
                [RESPONSE_HEAD, { type: ActionType.OPEN, sessionId }],
                [BROADCAST_HEAD, { type: ActionType.OPEN, sessionId }],
            ]
        }
    }
}

export function TODO(request: Request) {
    return new Response(null, {
        status: 404,
        headers: { 'Access-Control-Allow-Origin': 'http://localhost:5173' },
    })
}
