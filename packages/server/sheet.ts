export type Sheet = {
    id: string
    columnIds: number[]
    rowIds: number[]
    name: string
    defaultColumnWidth?: number // 默认列宽
    defaultRowHeight?: number // 默认行高
}
