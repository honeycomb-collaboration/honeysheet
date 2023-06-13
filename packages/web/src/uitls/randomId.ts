import { nanoid } from 'nanoid'
import { SheetId } from '@honeysheet/shared'

export function createUniqueID(prefix: string): SheetId {
    return prefix + nanoid()
}
