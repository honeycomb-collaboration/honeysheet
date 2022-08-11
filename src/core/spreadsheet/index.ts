import { Logger } from "../../tools/logger"
import { Store } from "../../store"
import { Sheet } from "../sheet"
import { Tools } from "src/tools"
import { Options } from '../../../types/options'
import { Exception } from "src/tools/exception"

export interface ISpreadSheet{
    id: string
    name: string
}

export class Spreadsheet implements ISpreadSheet{
    id: string
    name: string
    sheets: Sheet[]
    store: Store
    container: HTMLElement | null
    constructor(opts: Options){
        // 初始化: 配置参数、准备一些全局变量的值
        this.id = opts.id || Tools.CreateUniqueID()
        this.container = document.getElementById(opts.container)
        if(!this.container){
            Logger.error('Init Spreadsheet fail, dom element not found')
            new Exception('config key container','Init Spreadsheet fail, dom element not found')
        }
        this.name = opts.name
        this.sheets = []
        this.store = new Store(opts) // todo 定义数据
        Logger.info('初始化 SpreadSheet=', opts.name)
    }
    
    create(){
        Logger.info('创建电子表格 SpreadSheet=', this.name)
        const sheets = this.store.getSheets()
        for(let i=0,j=sheets.length; i<j; i++){
            this.sheets.push(new Sheet(opts))
        }
    }

    destroy(){

    }
}