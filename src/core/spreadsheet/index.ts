import { Logger } from '../../tools/logger'
import { initSheet, Sheet } from '../sheet'
import { Tools } from 'src/tools'
import { Options } from '../../../types/options'
import { Exception } from 'src/tools/exception'
import { getConnection } from '../../websocket'

export interface ISpreadSheet {
    id: string
    name: string
}

export class Spreadsheet implements ISpreadSheet {
    id: string
    name: string
    sheets: Sheet[]
    container: HTMLElement | null
    constructor(opts: Options) {
        // 初始化: 配置参数、准备一些全局变量的值
        this.id = opts.id || Tools.CreateUniqueID()
        this.container = document.getElementById(opts.container)
        if (!this.container) {
            Logger.error('Init Spreadsheet fail, dom element not found')
            new Exception('config key container', 'Init Spreadsheet fail, dom element not found')
        }
        this.name = opts.name || `New Honeycomb Spreadsheet`
        Logger.info('创建电子表格 SpreadSheet=', this.name)
        this.sheets = opts.sheets?.map(initSheet) || []
        Logger.info('初始化 SpreadSheet=', opts.name)
        if (opts.serverHost) {
            getConnection(opts.serverHost)
        }
    }

    destroy() {
        // TODO
    }
}
