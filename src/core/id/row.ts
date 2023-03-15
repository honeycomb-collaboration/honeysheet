import { getFirstId, Id, nextId } from './id'

export type RowId = Id

export const getInitialRowId: () => RowId = getFirstId

export const getNextRowId: (currentRowId: RowId) => RowId = nextId
