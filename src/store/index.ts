import { HeadDataType, BodyDataType } from '../../types/data'
import { Logger } from "../tools/logger"

export type StoreOptsType = {
    headData: HeadDataType,
    bodyData: BodyDataType,
}
export class Store{
    headData: HeadDataType // 内存中的表格数据
    bodyData: BodyDataType
    sheets: {} // sheets的配置数据
    constructor(opts: StoreOptsType){
        this.headData = opts.headData
        this.bodyData = opts.bodyData
        this.sheets = {}
        Logger.info('Store init')
    }

    /**
     * 初始化并返回 sheets 的配置数据
     * @returns 
     */
    getSheets(){
        return []
    }
}