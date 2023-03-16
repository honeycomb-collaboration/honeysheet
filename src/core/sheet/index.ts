import { Logger } from '../../tools'
import { CellId, ICell } from '../cell'
import { createUniqueID } from '../../uitls/randomId'
import { Destroyable } from '../interfaces/Destroyable'
import { deleteAllKeys } from '../../uitls/desturct'
import { AuthorizationOption } from '../constant'
import { RowId } from '../row'
import { ColumnId } from '../column'
import { generateIds } from '../../uitls/dataId'
import { forEach2dArray } from '../../uitls/2dArray'

export type CellRecord = { cell: ICell; rowId: RowId; columnId: ColumnId }

export type SheetOptions = {
    name: string // Spreadsheet 名称
    columnIds: ColumnId[]
    rowIds: ColumnId[]
    id?: string // Spreadsheet ID
    columnWidth?: number // 默认列宽
    rowHeight?: number // 默认行高
    authorization?: AuthorizationOption[] // 权限配置
    cells?: CellRecord[]
}

export class Sheet implements Destroyable {
    public readonly id: string
    public readonly name: string
    private readonly cellMap = new Map<CellId, ICell>()
    private readonly columnIds: ColumnId[]
    private readonly rowIds: RowId[]
    private readonly columnWidth?: number // 默认列宽
    private readonly rowHeight?: number // 默认行高
    private readonly authorization: Set<AuthorizationOption> // 权限配置
    constructor(options: SheetOptions) {
        Logger.info('初始化 sheet=', options.name)
        this.name = options.name
        this.id = options.id || createUniqueID('sheet')
        this.columnIds = options.columnIds
        this.rowIds = options.rowIds

        this.columnWidth = options.columnWidth
        this.rowHeight = options.rowHeight
        this.authorization = new Set(options.authorization)

        options.cells?.forEach((item) => {
            const cellId = `${item.columnId}_${item.rowId}` satisfies CellId
            if (this.cellMap.has(cellId)) {
                Logger.error(
                    'Sheet constructor',
                    'build cell map encounters duplicate cell',
                    cellId,
                    item.cell,
                )
            }
            this.cellMap.set(cellId, item.cell)
        })
    }

    public get cells(): ICell[][] {
        const result: ICell[][] = []
        this.rowIds.forEach((rowId) => {
            const row: ICell[] = []
            this.columnIds.forEach((columnId) => {
                row.push(this.cellMap.get(`${columnId}_${rowId}`) || { v: '' })
            })
            result.push(row)
        })
        return result
    }

    public setCellGrid(data: (number | string)[][]): void {
        const rowCount = data.length
        const columnCount = data[0]?.length || 0
        if (rowCount > this.rowIds.length) {
            this.rowIds.push(
                ...generateIds(rowCount - this.rowIds.length, this.rowIds[this.rowIds.length - 1]),
            )
        }
        if (columnCount > this.columnIds.length) {
            this.columnIds.push(
                ...generateIds(
                    columnCount - this.columnIds.length,
                    this.columnIds[this.columnIds.length - 1],
                ),
            )
        }

        forEach2dArray(data, (item, rowIndex, columnIndex) => {
            const cellId =
                `${this.columnIds[columnIndex]}_${this.rowIds[rowIndex]}` satisfies CellId
            this.cellMap.set(cellId, { v: item })
        })
    }

    destroy() {
        deleteAllKeys(this)
    }
}
