type IdCharacter =
    | '0'
    | '1'
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
    | '9'
    | 'a'
    | 'b'
    | 'c'
    | 'd'
    | 'e'
    | 'f'
    | 'g'
    | 'h'
    | 'i'
    | 'j'
    | 'k'
    | 'l'
    | 'm'
    | 'n'
    | 'o'
    | 'p'
    | 'q'
    | 'r'
    | 's'
    | 't'
    | 'u'
    | 'v'
    | 'w'
    | 'x'
    | 'y'
    | 'z'
    | 'A'
    | 'B'
    | 'C'
    | 'D'
    | 'E'
    | 'F'
    | 'G'
    | 'H'
    | 'I'
    | 'J'
    | 'K'
    | 'L'
    | 'M'
    | 'N'
    | 'O'
    | 'P'
    | 'Q'
    | 'R'
    | 'S'
    | 'T'
    | 'U'
    | 'V'
    | 'W'
    | 'X'
    | 'Y'
    | 'Z'

const IdCharList = `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`.split(
    '',
) as IdCharacter[]
const dict = new Map<IdCharacter, number>()
IdCharList.forEach((char, index) => {
    dict.set(char, index)
})

// /[a-zA-Z0-9]+/
export type DataId = string

export function validDataId<T extends DataId>(id: T): T {
    if (id === '' || /[^a-zA-Z0-9]/.test(id)) {
        throw new Error('validId fail, bad id format ' + id)
    }
    return id
}

export function getFirstDataId(): DataId {
    return IdCharList[0]
}

export function nextDataId(currentId: DataId): DataId {
    const chars = currentId.split('') as IdCharacter[]
    const newChars = []
    let overflow = false
    for (let i = chars.length - 1; i >= 0; i--) {
        const char = chars[i]
        const charIndex = dict.get(char)
        if (charIndex === undefined) {
            throw new Error('nextId fail, bad id format ' + currentId)
        }

        // 最后一位
        if (i === chars.length - 1) {
            // 已经是最后一个字符
            if (dict.get(char) === IdCharList.length - 1) {
                overflow = true // 标记进位
                newChars.unshift(IdCharList[0]) // 归零
            }
            // 不是最后一个字符
            else {
                // advance a char
                newChars.unshift(IdCharList[charIndex + 1])
            }
            continue
        }

        // 需要进位
        if (overflow) {
            // 已经是最后一个字符
            if (dict.get(char) === IdCharList.length - 1) {
                overflow = true // 继续标记进位
                newChars.unshift(IdCharList[0]) // 归零
            }
            // 不是最后一个字符
            else {
                overflow = false // 进位结束
                // advance a char
                newChars.unshift(IdCharList[charIndex + 1])
            }
            continue
        }

        newChars.unshift(char)
    }

    if (overflow) {
        newChars.unshift(IdCharList[0])
    }

    return newChars.join('')
}

export function generateIds(count: number, start = getFirstDataId()): DataId[] {
    let latestId = start
    const ids: DataId[] = [latestId]
    for (let i = 1; i < count; i++) {
        latestId = nextDataId(latestId) // maybe not call nextDataId
        ids.push(latestId)
    }
    return ids
}
