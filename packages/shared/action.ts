import { CellId, SheetId } from './core'

export enum ActionType {
    OPEN = 'OPEN',
    UPDATE_CELL_V = 'UPDATE_CELL_V',
}

/**
 * Requests
 **/

type OpenAction = {
    type: ActionType.OPEN
    workbookId: string
}

type UpdateCellVAction = {
    type: ActionType.UPDATE_CELL_V
    sheetId: SheetId
    cellId: CellId
    v: string | number
}

export type Action = OpenAction | UpdateCellVAction

/**
 * Responses
 **/

type OpenActionResponse = {
    type: ActionType.OPEN
    sessionId: string
}

type EditActionResponse = {
    type: ActionType.UPDATE_CELL_V
    ok: boolean
}

export type ActionResponse = OpenActionResponse | EditActionResponse
