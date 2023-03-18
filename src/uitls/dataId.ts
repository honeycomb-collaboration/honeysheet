// unsigned integer
export type DataId = number

export function validDataId<T extends DataId>(id: T): T {
    if (id < 0 || !Number.isInteger(id)) {
        throw new Error('validId fail, bad id format ' + id)
    }
    return id
}

export function generateIds(count: number, startAfter?: DataId): DataId[] {
    if (count < 0 || !Number.isInteger(count)) {
        throw new Error('generateIds bad count')
    }
    const ids: DataId[] = []
    if (startAfter !== undefined) {
        validDataId(startAfter)
        for (let i = startAfter + 1; i < count + startAfter + 1; i++) {
            ids.push(i)
        }
    } else {
        for (let i = 0; i < count; i++) {
            ids.push(i)
        }
    }
    return ids
}
