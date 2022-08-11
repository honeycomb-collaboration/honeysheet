import { HeadDataTypes, BodyDataType } from '../../types/data'
import { Logger } from "../tools/logger"
import { Options } from '../../types/options'

export type SheetStore = {
    headData: HeadDataTypes | [] // 内存中的表格数据
    bodyData: BodyDataType | []
}

export class Store{
    sheets: Map<string,SheetStore> // sheets的配置数据
    constructor(opts: Options){
        Logger.info('Store init')
        for(let i=0,j=opts.sheets.length; i<j; i++){
            if(opts.sheets.id)
        }
    }

    /**
     * 初始化并返回 sheets 的配置数据
     * @returns 
     */
    getSheetsData(){
        return []
    }

    /**
     * 返回某个 sheet 的配置数据
     * @returns 
     */
    getSheetData(sheetID: string){
        return []
    }
}