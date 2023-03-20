import { Destroyable, Logger } from '../../tools'
import { CellId, ICell } from '../cell'
import { createUniqueID } from '../../uitls/randomId'
import { AuthorizationOption, ColumnWidth, RowHeight } from '../constant'
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

export type SheetId = string

export class Sheet extends Destroyable {
    public readonly id: SheetId
    public readonly name: string
    private readonly cellMap = new Map<CellId, ICell>()
    private readonly columnIds: ColumnId[]
    private readonly rowIds: RowId[]
    private readonly columnWidth?: number // 默认列宽
    private readonly rowHeight?: number // 默认行高
    private readonly authorization: Set<AuthorizationOption> // 权限配置

    constructor(options: SheetOptions) {
        super()
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

    public get width(): number {
        return this.columnIds.length * ColumnWidth
    }

    public get height(): number {
        return this.rowIds.length * RowHeight
    }

    public getColumnIndex(x: number): number {
        const index = Math.trunc(x / ColumnWidth)
        return Math.min(index, this.columnIds.length - 1)
    }

    public getRowIndex(y: number): number {
        const index = Math.trunc(y / RowHeight)
        return Math.min(index, this.rowIds.length - 1)
    }

    public iterateCellGrid(
        {
            startRowIndex = 0,
            endRowIndex = this.rowIds.length,
            startColumnIndex = 0,
            endColumnIndex = this.columnIds.length,
        }: {
            startRowIndex: number
            endRowIndex: number
            startColumnIndex: number
            endColumnIndex: number
        },
        iteratee: (rowIndex: number, columnIndex: number, cell?: ICell) => void,
    ): void {
        for (let rowIndex = startRowIndex; rowIndex <= endRowIndex; rowIndex++) {
            const rowId = this.rowIds[rowIndex]
            for (let columnIndex = startColumnIndex; columnIndex <= endColumnIndex; columnIndex++) {
                const columnId = this.columnIds[columnIndex]
                const cell = this.cellMap.get(`${columnId}_${rowId}`)
                iteratee(rowIndex, columnIndex, cell)
            }
        }
    }

    public iterateRows(rowIteratee: (rowIndex: number) => void): void {
        for (let rowIndex = 0; rowIndex < this.rowIds.length; rowIndex++) {
            rowIteratee(rowIndex)
        }
    }
    public iterateColumns(columnIteratee: (columnIndex: number) => void): void {
        for (let columnIndex = 0; columnIndex < this.columnIds.length; columnIndex++) {
            columnIteratee(columnIndex)
        }
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
}
