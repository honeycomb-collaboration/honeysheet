import { DataId, generateIds, validDataId } from './dataId'

export type ColumnId = DataId
export type RowId = DataId
export type SheetId = string

export interface WorkbookDTO {
    id: string
    name?: string
    defaultColumnCount?: number // 默认列数
    defaultRowCount?: number // 默认行数
    defaultColumnWidth?: number // 默认列宽
    defaultRowHeight?: number // 默认行高
}

export interface SheetDTO {
    id: SheetId
    columnIds: ColumnId[]
    rowIds: RowId[]
    name?: string
    defaultColumnWidth?: number // 默认列宽
    defaultRowHeight?: number // 默认行高
}

export interface CellDTO {
    v: string | number
}

export type CellRecordDTO = { cell: CellDTO; rowId: RowId; columnId: ColumnId }

export { validDataId, generateIds }
