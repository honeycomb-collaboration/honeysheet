import { ColumnId } from '../column'
import { RowId } from '../row'
import { validDataId } from '../../uitls/dataId'

export type CellId = `${ColumnId}_${RowId}` // column id and row id concatenated

export function getCellIdByRcId(columnId: ColumnId, rowId: RowId): CellId {
    return `${columnId}_${rowId}`
}

export function getRcIdByCellId(id: CellId): { columnId: ColumnId; rowId: RowId } {
    const [columnId, rowId] = id.split('_').map(Number)

    return {
        columnId: validDataId(columnId),
        rowId: validDataId(rowId),
    }
}
