import { DataId, getFirstDataId, nextDataId } from '../../uitls/dataId'

export type ColumnId = DataId

export const getInitialColumnId: () => ColumnId = getFirstDataId

export const getNextColumnId: (currentColumnId: ColumnId) => ColumnId = nextDataId
