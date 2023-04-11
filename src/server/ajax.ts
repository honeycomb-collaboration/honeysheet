import { ColumnId } from '../core/column'
import { CellRecord } from '../core/cell'

export interface ResponseWorkbook {
    id: string
    name: string
    defaultColumnCount: number // 默认列数
    defaultRowCount: number // 默认行数
    defaultColumnWidth: number // 默认列宽
    defaultRowHeight: number // 默认行高
}

export interface ResponseSheet {
    id: string
    name: string
    columnIds: ColumnId[]
    rowIds: ColumnId[]
    columnWidth?: number // 默认列宽
    rowHeight?: number // 默认行高
}

export type ResponseCellRecords = CellRecord[]
