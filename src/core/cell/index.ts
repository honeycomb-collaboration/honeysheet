/**
 * todo 单元格操作逻辑放到这个文件夹下
 */

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICell {
    v: string | number
    // TODO
}

export class Cell {}

// Cell data type
export type DCell = number | string | ICell
