/**
 * 可配置参数
 */

// 授权相关配置：读、写、复制、评论
enum authorizationOptions{
    READ = 'READ',
    WRITE = 'WRITE',
    COPY = 'COPY',
    COMMENT = 'COMMENT'
}

type sheetOptions = {
    id: string | undefined // Spreadsheet ID
    name: string // Spreadsheet 名称
    columnNums: number // 默认列数
    rowNums: number // 默认行数
    columnWidth: number // 默认列宽
    rowHeight: number // 默认行高
    fontSize: number // 默认字体大小
    authorization: authorizationOptions // 权限配置
}

export interface Options {
    id: string | undefined // Spreadsheet ID
    name: string // Spreadsheet 名称
    columnNums: number // 默认列数
    rowNums: number // 默认行数
    columnWidth: number // 默认列宽
    rowHeight: number // 默认行高
    fontSize: number // 默认字体大小
    authorization: authorizationOptions // 权限配置
    sheets: sheetOptions[] // sheet 页配置
    dataUrl?: string // 服务端返回数据
    websocketUrl?: string // 长链接地址
}