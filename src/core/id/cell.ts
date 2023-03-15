import { ColumnId } from './column'
import { RowId } from './row'
import { validId } from './id'

export type CellId = `${ColumnId}_${RowId}` // column id and row id concatenated

export function getRcIdByCellId(id: CellId): { columnId: ColumnId; rowId: RowId } {
    const [columnId, rowId] = id.split('_')

    return {
        columnId: validId(columnId),
        rowId: validId(rowId),
    }
}
