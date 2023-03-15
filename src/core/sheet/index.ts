import { Logger } from '../../tools'
import { ICell } from '../cell'
import { map2dArray } from '../../uitls/2dArray'
import { createUniqueID } from '../../uitls/randomId'
import { Destroyable } from '../interfaces/Destroyable'
import { deleteAllKeys } from '../../uitls/desturct'
import { AuthorizationOption } from '../constant'

export type SheetOptions = {
    id?: string // Spreadsheet ID
    name: string // Spreadsheet 名称
    columnNums?: number // 默认列数
    rowNums?: number // 默认行数
    columnWidth?: number // 默认列宽
    rowHeight?: number // 默认行高
    authorization?: AuthorizationOption[] // 权限配置
    cells?: (number | string | ICell)[][]
}

export class Sheet implements Destroyable {
    public readonly id: string
    public readonly name: string
    public readonly cells: ICell[][]

    constructor(options: SheetOptions) {
        this.id = options.id || createUniqueID('sheet')
        this.name = options.name
        this.cells = options.cells
            ? map2dArray(options.cells, (item) => {
                  if (typeof item === 'string' || typeof item === 'number') {
                      return { v: item }
                  }
                  return item
              })
            : []
        // something init
        Logger.info('初始化 sheet=', options.name)
    }

    destroy() {
        deleteAllKeys(this)
    }
}
