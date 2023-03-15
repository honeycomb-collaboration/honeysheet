import { describe, expect, it } from 'vitest'
import { getRcIdByCellId } from './id'

describe('cell id', function () {
    it('getRcIdByCellId() ', function () {
        expect(getRcIdByCellId('a_b')).toEqual({ columnId: 'a', rowId: 'b' })
        expect(getRcIdByCellId('ab_c')).toEqual({ columnId: 'ab', rowId: 'c' })
        expect(getRcIdByCellId('ab_c')).toEqual({ columnId: 'ab', rowId: 'c' })
        expect(getRcIdByCellId('abZ_c')).toEqual({ columnId: 'abZ', rowId: 'c' })
        expect(() => getRcIdByCellId('abZ_')).toThrowError(/bad id/)
    })
})
