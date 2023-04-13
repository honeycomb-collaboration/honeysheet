import { Destroyable, Logger } from '../../tools'
import { Sheet, SheetId } from '../sheet'
import { Server } from '../../server'
import { Canvas2dRenderer, IRenderer } from '../renderer'
import { AuthorizationOption } from '../constant'

export type SpreadsheetOptions = {
    defaultColumnCount: number // 默认列数
    defaultRowCount: number // 默认行数
    defaultColumnWidth: number // 默认列宽
    defaultRowHeight: number // 默认行高
    name: string // Spreadsheet 名称
    sheets?: Sheet[] // sheet 页配置
    server?: Server
    authorization?: AuthorizationOption[] // 权限配置
}

export class Spreadsheet extends Destroyable {
    private static readonly record = new WeakMap<HTMLDivElement, Spreadsheet>()
    public readonly name: string
    private readonly sheetMap = new Map<SheetId, Sheet>()
    private readonly defaultColumnCount: number // 默认列数
    private readonly defaultRowCount: number // 默认行数
    private readonly defaultColumnWidth: number // 默认列宽
    private readonly defaultRowHeight: number // 默认行高
    private currentSheetId?: SheetId
    private readonly server?: Server
    private readonly renderer: IRenderer
    private readonly authorization: Set<AuthorizationOption> // 权限配置

    constructor(
        container: HTMLDivElement | null, // div 容器
        opts: SpreadsheetOptions,
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

        this.renderer = new Canvas2dRenderer(container)
        this.name = opts.name
        this.defaultColumnCount = opts.defaultColumnCount
        this.defaultRowCount = opts.defaultRowCount
        this.defaultColumnWidth = opts.defaultColumnWidth
        this.defaultRowHeight = opts.defaultRowHeight
        this.authorization = new Set(opts.authorization)
        if (opts.sheets) {
            this.addSheets(opts.sheets)
        }
        if (opts.server) {
            this.server = opts.server
        }

        Logger.info('初始化 SpreadSheet=', opts.name)
        Spreadsheet.record.set(container, this)
        this.onDestroy(() => Spreadsheet.record.delete(container))
    }

    public addSheets(sheets: Sheet[]) {
        sheets.forEach((sheet) => {
            this.sheetMap.set(sheet.id, sheet)
        })
        if (!this.currentSheetId && sheets[0]) {
            this.currentSheetId = sheets[0].id
            this.renderer.renderSheet(sheets[0])
        }
    }
}
