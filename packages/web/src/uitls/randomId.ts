import { nanoid } from 'nanoid'
import { SheetId } from '../core/sheet'

export function createUniqueID(prefix: string): SheetId {
    return prefix + nanoid()
}
