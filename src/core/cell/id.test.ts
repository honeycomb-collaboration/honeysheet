import { describe, expect, it } from 'vitest'
import { getRcIdByCellId } from './id'

describe('cell id', function () {
    it('getRcIdByCellId() ', function () {
        expect(getRcIdByCellId('1_2')).toEqual({ columnId: 1, rowId: 2 })
        expect(getRcIdByCellId('01_2')).toEqual({ columnId: 1, rowId: 2 })
        expect(getRcIdByCellId('10_2')).toEqual({ columnId: 10, rowId: 2 })
        expect(getRcIdByCellId('232_3')).toEqual({ columnId: 232, rowId: 3 })
        expect(() => getRcIdByCellId('123_-1')).toThrowError(/bad id/)
        expect(() => getRcIdByCellId('123_1.2')).toThrowError(/bad id/)
    })
})
