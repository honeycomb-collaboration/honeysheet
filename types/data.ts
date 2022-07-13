
/**
 * 表头数据
 * 
 * [
 *       {
 *           "id":"", // 列唯一ID
 *           "name":"", // 列展示的名字
 *           ...
 *       },
 *       {
 *           "id":"", // 列唯一ID
 *           "name":"", // 列展示的名字
 *           ...
 *       }
 *   ]
 */
export type HeadDataType = {
    id: string // 列唯一ID
    name: string // 列名
}

export type HeadDataTypes = HeadDataType[]

/**
 *  表体数据
 * 
 *  "${row_id}":"",
 *   "fields":{
 *       "colID1": { // 列唯一ID
 *           "name":"", // 行显示的名字
 *           "v":{}, // 表格数据
 *           "type":"" // 单元格类型，字符串、文本、日期等
 *       },
 *       "colID2": {// 列唯一ID
 *           "name":"", // 行显示的名字
 *           "v":{}, // 表格数据
 *           "type":"" // 单元格类型，字符串、文本、日期等
 *       },
 *   } 
 */
type CellDataType = {
    name: string // 行名
    type: string // 行类型
    v: any // todo 为每一种类型定义具体的 v
}

type Fields = {
    [key: string]: CellDataType
}

export type BodyDataType = {
    [key: string]: string | Fields
}