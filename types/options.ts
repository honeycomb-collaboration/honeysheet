import { ICell } from '../src/core/cell'

/**
 * 可配置参数
 */
// 授权相关配置：读、写、复制、评论
enum authorizationOptions {
    READ = 'READ',
    WRITE = 'WRITE',
    COPY = 'COPY',
    COMMENT = 'COMMENT',
}

export type SheetOptions = {
    id?: string // Spreadsheet ID
    name?: string // Spreadsheet 名称
    columnNums?: number // 默认列数
    rowNums?: number // 默认行数
    columnWidth?: number // 默认列宽
    rowHeight?: number // 默认行高
    authorization?: authorizationOptions // 权限配置
    cells?: (number | string | ICell)[][]
}

export type Options = {
    container: string // 容器 querySelector 参数
    id?: string // Spreadsheet ID
    name?: string // Spreadsheet 名称
    columnNums?: number // 默认列数
    rowNums?: number // 默认行数
    columnWidth?: number // 默认列宽
    rowHeight?: number // 默认行高
    fontSize?: number // 默认字体大小
    authorization?: authorizationOptions // 权限配置
    sheets?: SheetOptions[] // sheet 页配置
    serverHost?: string // 服务主机
}
