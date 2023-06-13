import { CellId } from '../cell'
import { SheetId } from '@honeysheet/shared'

export enum ActionType {
    UPDATE_CELL_V = 'UPDATE_CELL_V',
}

export type UpdateCellVAction = {
    type: ActionType.UPDATE_CELL_V
    sheetId: SheetId
    cellId: CellId
    v: string | number
}

export type Action = UpdateCellVAction

export interface ActionTarget {
    dispatch(action: Action): void

    apply(action: Action): void

    revoke(action: Action): void
}
