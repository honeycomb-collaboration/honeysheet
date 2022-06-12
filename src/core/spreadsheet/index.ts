export interface ISpreadSheet{
    id: string
    name: string
}

export class SpreadSheet implements ISpreadSheet{
    id: string
    name: string
    constructor(){
        // something init
    }
}