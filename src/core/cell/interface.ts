import { RowId } from '../row'
import { ColumnId } from '../column'

export interface ICell {
    v: string | number
}

export type CellRecord = { cell: ICell; rowId: RowId; columnId: ColumnId }
