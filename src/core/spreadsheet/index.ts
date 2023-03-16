import { Logger } from '../../tools'
import { Sheet, SheetOptions } from '../sheet'
import { Exception } from 'src/tools'
import { getConnection } from '../../websocket'
import { Canvas2dRenderer, IRenderer } from '../renderer'
import { Destroyable } from '../interfaces/Destroyable'
import { deleteAllKeys } from '../../uitls/desturct'
import { createUniqueID } from '../../uitls/randomId'
import { AuthorizationOption } from '../constant'
import { generateIds } from '../../uitls/dataId'

const DefaultRowCount = 30
const DefaultColumnCount = 10

export type SpreadSheetOptions = {
    container: string // 容器 querySelector 参数
    id?: string // Spreadsheet ID
    name?: string // Spreadsheet 名称
    columnCount?: number // 默认列数
    rowCount?: number // 默认行数
    columnWidth?: number // 默认列宽
    rowHeight?: number // 默认行高
    fontSize?: number // 默认字体大小
    authorization?: AuthorizationOption[] // 权限配置
    sheets?: Partial<SheetOptions>[] // sheet 页配置
    serverHost?: string // 服务主机
}

export class Spreadsheet implements Destroyable {
    id: string
    name: string
    sheets: Sheet[]
    container: HTMLElement
    private readonly renderer: IRenderer
    constructor(opts: SpreadSheetOptions) {
        // 初始化: 配置参数、准备一些全局变量的值
        this.id = opts.id || createUniqueID('honey')
        const container = document.getElementById(opts.container)
        if (!container) {
            Logger.error('Init Spreadsheet fail, dom element not found')
            throw new Exception(
                'config key container',
                'Init Spreadsheet fail, dom element not found',
            )
        }
        this.container = container
        this.renderer = new Canvas2dRenderer(this.container)
        this.name = opts.name || `New Honeycomb Spreadsheet`
        Logger.info('创建电子表格 SpreadSheet=', this.name)
        this.sheets =
            opts.sheets?.map((item, index) => {
                const rowCount = opts.rowCount || DefaultRowCount
                const columnCount = opts.columnCount || DefaultColumnCount

                return new Sheet({
                    name: item.name || `Sheet ${index}`,
                    columnIds: item.columnIds || generateIds(columnCount),
                    rowIds: item.rowIds || generateIds(rowCount),
                    id: item.id,
                    cells: item.cells,
                    columnWidth: item.columnWidth || opts.columnWidth,
                    rowHeight: item.rowHeight || opts.rowHeight,
                    authorization: item.authorization,
                })
            }) || []
        Logger.info('初始化 SpreadSheet=', opts.name)
        if (opts.serverHost) {
            getConnection(opts.serverHost)
        }

        this.renderCurrentSheet()
        window.addEventListener('resize', this.renderCurrentSheet)
    }

    private readonly renderCurrentSheet = () => {
        if (this.sheets[0]) {
            this.renderer.resize(this.container)
            this.renderer.render(this.sheets[0])
        }
    }

    destroy() {
        window.removeEventListener('resize', this.renderCurrentSheet)
        deleteAllKeys(this)
    }
}
