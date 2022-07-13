import { nanoid } from 'nanoid'

export class Tools{
    
    static CreateUniqueID(prefix?: string): string{
       return prefix || '' + nanoid()
    }

}