import { CellId, SheetId } from './core'

export enum ActionType {
    UPDATE_CELL_V = 'UPDATE_CELL_V',
}

type UpdateCellVAction = {
    type: ActionType.UPDATE_CELL_V
    sheetId: SheetId
    cellId: CellId
    v: string | number
}

export type Action = UpdateCellVAction
