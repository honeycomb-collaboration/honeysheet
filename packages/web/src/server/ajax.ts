import { ColumnId } from '../core/column'
import { RowId } from '../core/row'
import { SheetId } from '../core/sheet'

export interface ResponseWorkbook {
    id: string
    name?: string
    defaultColumnCount?: number // 默认列数
    defaultRowCount?: number // 默认行数
    defaultColumnWidth?: number // 默认列宽
    defaultRowHeight?: number // 默认行高
}

export interface ResponseSheet {
    id: SheetId
    columnIds: ColumnId[]
    rowIds: RowId[]
    name?: string
    defaultColumnWidth?: number // 默认列宽
    defaultRowHeight?: number // 默认行高
}
