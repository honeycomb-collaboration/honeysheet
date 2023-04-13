import { Spreadsheet } from './spreadsheet'
import { Server } from '../../server'
import { Sheet } from '../sheet'
import { AuthorizationOption, ColumnWidth, RowHeight } from '../constant'
import { ICell } from '../cell'
import { createUniqueID } from '../../uitls/randomId'
import { generateIds } from '../../uitls/dataId'

const DefaultRowCount = 30
const DefaultColumnCount = 10

export async function createHoneysheetFromServer(
    container: HTMLDivElement | null, // div 容器
    host: string,
    id: string,
    configs?: {
        authorization?: AuthorizationOption[] // 权限配置
        defaultColumnCount?: number // 默认列数
        defaultRowCount?: number // 默认行数
        defaultColumnWidth?: number // 默认列宽
        defaultRowHeight?: number // 默认行高
    },
): Promise<Spreadsheet> {
    const server = new Server(host)
    const honeysheetData = await server.getWorkbook(id)
    const honeysheet = new Spreadsheet(container, {
        name: honeysheetData.name || `New Honeycomb Spreadsheet`, // Spreadsheet 名称
        defaultColumnCount:
            honeysheetData.defaultColumnCount || configs?.defaultColumnCount || DefaultColumnCount, // 默认列数
        defaultRowCount:
            honeysheetData.defaultRowCount || configs?.defaultRowCount || DefaultRowCount, // 默认行数
        defaultColumnWidth:
            honeysheetData.defaultColumnWidth || configs?.defaultColumnWidth || ColumnWidth, // 默认列宽
        defaultRowHeight: honeysheetData.defaultRowHeight || configs?.defaultRowHeight || RowHeight, // 默认行高
        // sheets?: Sheet[] // sheet 页配置
        server,
        // authorization:  // 权限配置
    })
    server.getWorkbookSheets(id).then((sheets) => {
        honeysheet.addSheets(
            sheets.map(
                (sheet, index) =>
                    new Sheet({
                        ...sheet,
                        name: sheet.name || `Sheet ${index + 1}`,
                        authorization: [],
                    }),
            ),
        )
    })
    return honeysheet
}

type InitSheetOptions = {
    cells: ICell[][] // TODO support primitive values
    name?: string
    columnCount?: number // 列数
    rowCount?: number // 行数
    defaultColumnWidth?: number // 默认列宽
    defaultRowHeight?: number // 默认行高
    authorization?: AuthorizationOption[] // 权限配置
}

function createSheetsFromInitData(
    options: InitSheetOptions[],
    defaultColumnCount: number, // 默认列数
    defaultRowCount: number, // 默认行数
): Sheet[] {
    return options.map((item, index) => {
        const rowCount = item.rowCount || defaultRowCount
        const columnCount = item.columnCount || defaultColumnCount

        const sheet = new Sheet({
            id: createUniqueID('sheet'),
            name: item.name || `Sheet ${index}`,
            columnIds: generateIds(columnCount),
            rowIds: generateIds(rowCount),
            defaultColumnWidth: item.defaultColumnWidth,
            defaultRowHeight: item.defaultRowHeight,
            authorization: item.authorization,
        })
        sheet.setCellGrid(item.cells)

        return sheet
    })
}

export function createHoneysheetFromData(
    container: HTMLDivElement | null, // div 容器
    sheets: InitSheetOptions[],
    configs?: {
        name?: string
        authorization?: AuthorizationOption[] // 权限配置
        defaultColumnCount?: number // 默认列数
        defaultRowCount?: number // 默认行数
        defaultColumnWidth?: number // 默认列宽
        defaultRowHeight?: number // 默认行高
    },
): Spreadsheet {
    const ss = createSheetsFromInitData(
        sheets,
        configs?.defaultColumnCount || DefaultColumnCount,
        configs?.defaultRowCount || DefaultRowCount,
    )
    return new Spreadsheet(container, {
        defaultColumnCount: configs?.defaultColumnCount || DefaultColumnCount,
        defaultRowCount: configs?.defaultRowCount || DefaultRowCount,
        defaultColumnWidth: configs?.defaultColumnWidth || ColumnWidth,
        defaultRowHeight: configs?.defaultRowHeight || RowHeight,

        name: configs?.name || `New Honeycomb Spreadsheet`,
        sheets: ss,
        authorization: configs?.authorization,
    })
}
