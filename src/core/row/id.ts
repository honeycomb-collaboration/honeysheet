import { DataId, getFirstDataId, nextDataId } from '../../uitls/dataId'

export type RowId = DataId

export const getInitialRowId: () => RowId = getFirstDataId

export const getNextRowId: (currentRowId: RowId) => RowId = nextDataId
