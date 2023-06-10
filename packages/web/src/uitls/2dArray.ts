export function map2dArray<T, U>(
    array: T[][],
    mapper: (item: T, rowIndex: number, columnIndex: number) => U,
): U[][] {
    return array.map((row, rowIndex) =>
        row.map((item, columnIndex) => mapper(item, rowIndex, columnIndex)),
    )
}

export function forEach2dArray<T = never>(
    array: T[][],
    callback: (item: T, rowIndex: number, columnIndex: number) => unknown,
): void {
    array.forEach((row, rowIndex) => {
        row.forEach((item, columnIndex) => callback(item, rowIndex, columnIndex))
    })
}
