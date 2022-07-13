import { Logger } from "../../tools/logger"
import { Store } from "../../store"
import { Sheet } from "../sheet"
import { Tools } from "src/tools"

export interface ISpreadSheet{
    id: string
    name: string
}

type SpreadSheetType = {
    id: string | undefined,
    name: string,
    sheets: Sheet[],
    spreadsheetUrl: string
}

export class SpreadSheet implements ISpreadSheet{
    id: string
    name: string
    sheets: Sheet[]
    store: Store
    spreadsheetUrl: string
    constructor(opts: SpreadSheetType){
        // 初始化: 配置参数、准备一些全局变量的值
        this.id = opts.id || Tools.CreateUniqueID()
        this.name = opts.name
        this.sheets = []
        this.store = new Store() // todo 定义数据
        this.spreadsheetUrl = opts.spreadsheetUrl
        Logger.info('初始化 SpreadSheet=', opts.name)
    }
    
    create(){
        Logger.info('创建电子表格 SpreadSheet=', this.name)
        const sheets = this.store.getSheets()
        for(let i=0,j=sheets.length; i<j; i++){
            this.sheets.push(new Sheet())
        }
    }

    destroy(){

    }
}