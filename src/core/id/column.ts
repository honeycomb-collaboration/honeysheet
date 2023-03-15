import { getFirstId, Id, nextId } from './id'

export type ColumnId = Id

export const getInitialColumnId: () => ColumnId = getFirstId

export const getNextColumnId: (currentColumnId: ColumnId) => ColumnId = nextId
