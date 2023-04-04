import { Destroyable, Logger } from '../../tools'
import { CellId, ICell } from '../cell'
import { createUniqueID } from '../../uitls/randomId'
import {
    AuthorizationOption,
    ColumnHeadHeight,
    ColumnWidth,
    RowHeadWidth,
    RowHeight,
} from '../constant'
import { RowId } from '../row'
import { ColumnId } from '../column'
import { generateIds } from '../../uitls/dataId'
import { forEach2dArray } from '../../uitls/2dArray'
import { SelectedArea } from '../renderer/canvas2d/selection'
import { IRenderer } from '../renderer'

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

export type SelectArea = { rowIds: Array<RowId>; columnIds: Array<ColumnId> }

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

    private selection: SelectedArea[] = []

    getCell(rowId: RowId, columnId: ColumnId): ICell {
        const cell = this.cellMap.get(`${columnId}_${rowId}`)
        if (!cell) {
            const err = `no cell with columnId=${columnId} rowId=${rowId}`
            throw new Error(err)
        }
        return cell
    }

    updateCell(rowId: RowId, columnId: ColumnId, value: string | number) {
        const cell = this.getCell(rowId, columnId)
        cell.v = value
    }

    public loopSelection(
        iteratee: (selectArea: {
            area: SelectedArea
            x: number
            y: number
            width: number
            height: number
        }) => void,
    ) {
        this.selection.forEach((area) => {
            let x = this.getCellOffsetX(area.columnIds[0])
            let y = this.getCellOffsetY(area.rowIds[0])
            const lastColumnId = area.columnIds[area.columnIds.length - 1]
            const lastRowId = area.rowIds[area.rowIds.length - 1]
            const width = this.getCellOffsetX(lastColumnId) - x + ColumnWidth
            const height = this.getCellOffsetY(lastRowId) - y + RowHeight
            area.columnIds.forEach((columnId) => {
                x = Math.min(this.getCellOffsetX(columnId), x)
            })
            area.rowIds.forEach((rowId) => {
                y = Math.min(this.getCellOffsetY(rowId), y)
            })
            iteratee({ area, x, y, width, height })
        })
    }

    public getColumnIndex(x: number): number {
        const index = Math.trunc(x / ColumnWidth)
        return Math.min(index, this.columnIds.length - 1)
    }

    public getRowIndex(y: number): number {
        const index = Math.trunc(y / RowHeight)
        return Math.min(index, this.rowIds.length - 1)
    }

    public selectArea(renderer: IRenderer, start: { x: number; y: number }): void {
        const columnIndex = this.getColumnIndex(start.x)
        const rowIndex = this.getRowIndex(start.y)
        this.ensureSelectedAreas(renderer, [[this.rowIds[rowIndex]], [this.columnIds[columnIndex]]])
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

    private getCellOffsetX(columnId: ColumnId): number {
        const columnIndex = this.columnIds.findIndex((id) => id === columnId)
        return columnIndex * ColumnWidth + RowHeadWidth
    }

    private getCellOffsetY(rowId: number): number {
        const rowIndex = this.rowIds.findIndex((id) => id === rowId)
        return rowIndex * RowHeight + ColumnHeadHeight
    }

    private ensureSelectedAreas(
        renderer: IRenderer,
        ...areas: [Array<RowId>, Array<ColumnId>][]
    ): void {
        const count = areas.length

        if (this.selection.length > count) {
            const deleted = this.selection.splice(count, this.selection.length - count)
            deleted.forEach((sa) => sa.destroy())
            this.selection.forEach((sa, index) => {
                sa.rowIds = areas[index][0]
                sa.columnIds = areas[index][1]
            })
            return
        }

        if (this.selection.length < count) {
            const newSas = areas
                .slice(count - this.selection.length - 1)
                .map((area) => new SelectedArea(this, renderer, area[0], area[1]))
            this.selection.forEach((sa, index) => {
                sa.rowIds = areas[index][0]
                sa.columnIds = areas[index][1]
            })
            this.selection.push(...newSas)
            return
        }

        this.selection.forEach((sa, index) => {
            sa.rowIds = areas[index][0]
            sa.columnIds = areas[index][1]
        })
    }
}
