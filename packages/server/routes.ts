import {
    ControllerFunction,
    GetCell,
    GetSheet,
    GetSheetCells,
    GetWorkbook,
    GetWorkbookSheets,
    TODO,
    UpgradeWebSocket,
} from './controller'

type Method = 'GET' | 'POST'

const routes: Array<[Method, string, ControllerFunction]> = [
    // create one workbook
    ['POST', '/api/v1/workbook', TODO],
    // get a workbook
    ['GET', '/api/v1/workbook/:workbookId', GetWorkbook],
    // get a workbook's sheets
    ['GET', '/api/v1/workbook/:workbookId/sheet', GetWorkbookSheets],
    // get a sheet
    ['GET', '/api/v1/sheet/:sheetId', GetSheet],
    // get a sheet's columns
    ['GET', '/api/v1/sheet/:sheetId/column', TODO],
    // get a sheet's specific column
    ['GET', '/api/v1/sheet/:sheetId/column/:columnId', TODO],
    // get a sheet's rows
    ['GET', '/api/v1/sheet/:sheetId/row', TODO],
    // get a sheet's specific row
    ['GET', '/api/v1/sheet/:sheetId/row/:rowId', TODO],
    // get a sheet's cells
    ['GET', '/api/v1/sheet/:sheetId/cell', GetSheetCells],
    // get a sheet's specific cell
    ['GET', '/api/v1/sheet/:sheetId/cell/:cellId', GetCell],
    // WebSocket endpoint
    ['GET', '/api/v1/ws', UpgradeWebSocket],
]

function matchUrl(pathname: string, endpoint: string): boolean {
    const sourceParts = pathname.split('/')
    const targetParts = endpoint.split('/')
    return (
        sourceParts.length === targetParts.length &&
        sourceParts.every((sourcePart, index) => {
            const targetPart = targetParts[index]
            return sourcePart === targetPart || targetPart.startsWith(':')
        })
    )
}

export function resolveController(request: Request) {
    const url = new URL(request.url)
    const route = routes.find(
        (route) => matchUrl(url.pathname, route[1]) && route[0] === request.method,
    )
    return route ? route[2] : TODO
}
