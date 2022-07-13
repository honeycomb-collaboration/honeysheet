import { Logger } from "../../tools/logger"

// 是否激活
export enum SheetStatus{
    Active = 1,
    UnActive = 0
}

export type SheetOptType = {
    id: string
    name: string
    status: SheetStatus
}

export class Sheet{
    id: string
    name: string
    status: SheetStatus 
    constructor(opt: SheetOptType){
        this.id = opt.id
        this.name = opt.name
        this.status = opt.status
        // something init
        Logger.info('初始化 sheet=',opt.name)
    }

    create(){
        // todo 继续常见行对象 、列对象

    }

    draw(){
        // todo 绘制当前 sheet。
    }
    
    destroy(){

    }
}