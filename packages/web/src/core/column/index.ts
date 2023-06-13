export type { IColumn } from './interface'

/**
 * 列名转为序号
 * @param columnName
 */
export function columnNameToIndex(columnName: string): number {
    columnName = columnName.trim()
    if (columnName.length === 0) {
        return NaN
    }

    const chars = columnName.toUpperCase().split('')
    const len = chars.length
    let result = 0

    for (let i = 0; i < len; i++) {
        const digit = chars[i].charCodeAt(0) - 65 + 1 // 65 is 'A'
        if (digit <= 0 || digit > 26) {
            return NaN
        }
        result += digit * Math.pow(26, len - i - 1)
    }

    if (result === 0) {
        return NaN
    }

    return result - 1
}

/**
 * 序号转为列名
 * @param index
 */
export function indexToColumnName(index: number): string {
    let letters = ''
    while (index >= 0) {
        letters = String.fromCharCode((index % 26) + 65) + letters // 65 is 'A'
        index = Math.trunc(index / 26) - 1
    }

    return letters
}
