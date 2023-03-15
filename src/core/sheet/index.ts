import { Logger } from '../../tools/logger'
import { SheetOptions } from '../../../types/options'
import { ICell } from '../cell'
import { map2dArray } from '../../uitls/2dArray'

export class Sheet {
    public readonly id: string
    public readonly name: string
    public readonly cells: ICell[][]

    constructor(options: SheetOptions) {
        this.id = options.id || `NewSheetId` // todo generate new sheet id
        this.name = options.name || `NewSheetName` // todo new sheet name should be required
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

    create() {
        // todo 继续常见行对象 、列对象
    }

    destroy() {
        // TODO
    }
}
