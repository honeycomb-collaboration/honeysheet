import { nanoid } from 'nanoid'

export function createUniqueID(prefix: string): string {
    return prefix + nanoid()
}
