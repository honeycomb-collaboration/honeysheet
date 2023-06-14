import { DataId } from './dataId'

export type ColumnId = DataId
export type RowId = DataId
export type SheetId = string
export type CellId = `${ColumnId}_${RowId}` // column id and row id concatenated
