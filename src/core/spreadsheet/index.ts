import { Destroyable, Logger } from '../../tools'
import { Sheet, SheetId } from '../sheet'
import { getConnection } from '../../websocket'
import { Canvas2dRenderer } from '../renderer'
import { createUniqueID } from '../../uitls/randomId'
import { AuthorizationOption, ColumnWidth, RowHeight } from '../constant'
import { generateIds } from '../../uitls/dataId'
import { ICell } from '../cell'

const DefaultRowCount = 30
const DefaultColumnCount = 10

type InitSheetOptions = {
    cells: ICell[][]
    name?: string
    columnCount?: number // 列数
    rowCount?: number // 行数
    columnWidth?: number // 列宽
    rowHeight?: number // 行高
    authorization?: AuthorizationOption[] // 权限配置
}

export interface ServerHoneySheetOptions {
    id: string
    serverHost: string // 服务主机
}

export interface LocalHoneySheetOptions {
    name?: string // Spreadsheet 名称
    columnCount?: number // 默认列数
    rowCount?: number // 默认行数
    columnWidth?: number // 默认列宽
    rowHeight?: number // 默认行高
    sheets: InitSheetOptions[] // sheet 页配置
}

export type SpreadSheetOptions = LocalHoneySheetOptions | ServerHoneySheetOptions

export class Spreadsheet extends Destroyable {
    private static readonly record = new WeakMap<HTMLDivElement, Spreadsheet>()
    id: string
    name: string
    sheetMap = new Map<SheetId, Sheet>()
    private currentSheetId: SheetId

    defaultColumnCount: number // 默认列数
    defaultRowCount: number // 默认行数
    defaultColumnWidth: number // 默认列宽
    defaultRowHeight: number // 默认行高

    constructor(
        container: HTMLDivElement | null, // div 容器
        authorization: AuthorizationOption[], // 权限配置
        opts: SpreadSheetOptions,
    ) {
        super()
        if (!container) {
            console.error(container, 'does not exist')
            throw new Error('Container does not exist')
        }

        if (Spreadsheet.record.has(container)) {
            console.error(container, 'already is a honeysheet')
            throw new Error('Already a honeysheet')
        }

        if ('serverHost' in opts) {
            getConnection(opts.serverHost)
            throw new Error('TODO: Honeysheet server')
        } else {
            this.id = createUniqueID('honey')
            this.name = opts.name || `New Honeycomb Spreadsheet`
            this.defaultColumnCount = opts.columnCount || DefaultColumnCount
            this.defaultRowCount = opts.rowCount || DefaultRowCount
            this.defaultColumnWidth = opts.columnWidth || ColumnWidth
            this.defaultRowHeight = opts.rowHeight || RowHeight

            const sheets = this.createSheetsFromInitData(opts.sheets)
            if (sheets.length === 0) {
                throw new Error(`sheets array can't be empty`)
            }
            this.currentSheetId = sheets[0].id
            Logger.info('初始化 SpreadSheet=', opts.name)
        }

        const renderer = new Canvas2dRenderer(container)
        renderer.renderSheet(this.currentSheet)
        Spreadsheet.record.set(container, this)
        this.onDestroy(() => Spreadsheet.record.delete(container))
    }

    private get currentSheet(): Sheet {
        const sheet = this.sheetMap.get(this.currentSheetId)
        if (!sheet) {
            throw new Error('current Sheet undefined.')
        }
        return sheet
    }

    private createSheetsFromInitData(options: InitSheetOptions[]): Sheet[] {
        return options.map((item, index) => {
            const rowCount = item.rowCount || this.defaultRowCount
            const columnCount = item.columnCount || this.defaultColumnCount

            const sheet = new Sheet({
                id: createUniqueID('sheet'),
                name: item.name || `Sheet ${index}`,
                columnIds: generateIds(item.columnCount || columnCount),
                rowIds: generateIds(item.rowCount || rowCount),
                columnWidth: item.columnWidth,
                rowHeight: item.rowHeight,
                authorization: item.authorization || [],
            })
            sheet.setCellGrid(item.cells)

            this.sheetMap.set(sheet.id, sheet)
            return sheet
        })
    }
}
