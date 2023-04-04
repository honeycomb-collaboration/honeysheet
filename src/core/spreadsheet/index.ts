import { Destroyable, Logger } from '../../tools'
import { Sheet, SheetId, SheetOptions } from '../sheet'
import { getConnection } from '../../websocket'
import { Canvas2dRenderer, IRenderer } from '../renderer'
import { createUniqueID } from '../../uitls/randomId'
import { AuthorizationOption } from '../constant'
import { generateIds } from '../../uitls/dataId'

const DefaultRowCount = 30
const DefaultColumnCount = 10

const honeysheetRef = Symbol('honeysheet')
type ContainerElement = HTMLElement & { [honeysheetRef]?: Spreadsheet }

export type SpreadSheetOptions = {
    container: ContainerElement // 容器 querySelector 参数
    id?: string // Spreadsheet ID
    name?: string // Spreadsheet 名称
    columnCount?: number // 默认列数
    rowCount?: number // 默认行数
    columnWidth?: number // 默认列宽
    rowHeight?: number // 默认行高
    fontSize?: number // 默认字体大小
    authorization?: AuthorizationOption[] // 权限配置
    sheets: Partial<SheetOptions>[] // sheet 页配置
    serverHost?: string // 服务主机
}

export class Spreadsheet extends Destroyable {
    id: string
    name: string
    sheetMap = new Map<SheetId, Sheet>()
    private currentSheetId: SheetId
    private readonly renderer: IRenderer

    constructor(opts: SpreadSheetOptions) {
        super()
        if (opts.container[honeysheetRef]) {
            console.error(opts.container, 'already is a honeysheet')
            throw new Error('Already a honeysheet')
        }
        this.id = opts.id || createUniqueID('honey')
        this.renderer = new Canvas2dRenderer(opts.container)
        this.name = opts.name || `New Honeycomb Spreadsheet`

        const sheets = opts.sheets.map((item, index) => {
            const rowCount = opts.rowCount || DefaultRowCount
            const columnCount = opts.columnCount || DefaultColumnCount

            const sheet = new Sheet({
                name: item.name || `Sheet ${index}`,
                columnIds: item.columnIds || generateIds(columnCount),
                rowIds: item.rowIds || generateIds(rowCount),
                id: item.id,
                cells: item.cells,
                columnWidth: item.columnWidth || opts.columnWidth,
                rowHeight: item.rowHeight || opts.rowHeight,
                authorization: item.authorization,
            })

            if (this.sheetMap.has(sheet.id)) {
                throw new Error('duplicate sheet id ' + sheet.id)
            }
            this.sheetMap.set(sheet.id, sheet)
            return sheet
        })
        if (sheets.length === 0) {
            throw new Error(`sheets array can't be empty`)
        }
        this.currentSheetId = sheets[0].id

        Logger.info('初始化 SpreadSheet=', opts.name)
        if (opts.serverHost) {
            getConnection(opts.serverHost)
        }

        this.renderCurrentSheet()
        opts.container[honeysheetRef] = this
        this.onDestroy(() => delete opts.container[honeysheetRef])
    }

    public get currentSheet(): Sheet {
        const sheet = this.sheetMap.get(this.currentSheetId)
        if (!sheet) {
            throw new Error('current Sheet undefined.')
        }
        return sheet
    }

    public renderCurrentSheet() {
        this.renderer.renderSheet(this.currentSheet)
    }
}
