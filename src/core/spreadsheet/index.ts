import { Logger } from '../../tools'
import { Sheet } from '../sheet'
import { Options } from '../../../types/options'
import { Exception } from 'src/tools'
import { getConnection } from '../../websocket'
import { Canvas2dRenderer, IRenderer } from '../renderer'
import { Destroyable } from '../interfaces/Destroyable'
import { deleteAllKeys } from '../../uitls/desturct'
import { createUniqueID } from '../../uitls/randomId'

export interface ISpreadSheet {
    id: string
    name: string
}

export class Spreadsheet implements ISpreadSheet, Destroyable {
    id: string
    name: string
    sheets: Sheet[]
    container: HTMLElement
    private readonly renderer: IRenderer
    constructor(opts: Options) {
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
        this.sheets = opts.sheets?.map((item) => new Sheet(item)) || []
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
