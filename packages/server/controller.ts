import { Workbook } from './workbook'
import { Sheet } from './sheet'
import { CellRecord } from './cell'

export type ControllerFunction = (request: Request) => Response | void

const workbook: Workbook = {
    id: 'honeysheet_id',
    name: 'My Honeysheet',
    defaultColumnCount: 36, // 默认列数
    defaultRowCount: 36, // 默认行数
    defaultColumnWidth: 120, // 默认列宽
    defaultRowHeight: 40, // 默认行高
}

const sheets: Sheet[] = [
    {
        id: '1',
        name: 'Sheet 1',
        columnIds: [0, 1, 2, 3, 4],
        rowIds: [0, 1, 2, 3, 4],
    },
]

const cells: CellRecord[] = [
    {
        columnId: 0,
        rowId: 0,
        cell: { v: 'R0_C0' },
    },
]

export function GetWorkbook(request: Request) {
    const res = new Response(JSON.stringify(workbook), {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Content-Type': 'application/json; charset=utf-8',
        },
    })
    return res
}

export function GetWorkbookSheets(request: Request) {
    const res = new Response(JSON.stringify(sheets), {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Content-Type': 'application/json; charset=utf-8',
        },
    })
    return res
}

export function GetSheet(request: Request) {
    //
}

export function GetSheetCells(request: Request) {
    const res = new Response(JSON.stringify(cells), {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Content-Type': 'application/json; charset=utf-8',
        },
    })
    return res
}

export function GetCell(request: Request) {
    //
}

export function TODO(request: Request) {
    const res = new Response(null, {
        status: 404,
        headers: { 'Access-Control-Allow-Origin': 'http://localhost:5173' },
    })
    return res
}
