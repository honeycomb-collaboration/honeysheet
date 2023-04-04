import { Sheet } from '../sheet'
import { Destroyable } from '../../tools'
import { RowId } from '../row'
import { ColumnId } from '../column'

export interface IRenderer extends Destroyable {
    renderSheet(sheet: Sheet): void

    render(): void

    renderCell(rowId: RowId, columnId: ColumnId): void
}
