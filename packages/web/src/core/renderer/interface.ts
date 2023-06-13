import { Sheet } from '../sheet'
import { Destroyable } from '../../tools'
import { ColumnId, RowId } from '@honeysheet/shared'

export interface IRenderer extends Destroyable {
    renderSheet(sheet: Sheet): void

    render(): void

    renderCell(rowId: RowId, columnId: ColumnId): void
}
