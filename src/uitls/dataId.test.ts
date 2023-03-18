import { describe, expect, it } from 'vitest'
import { generateIds, validDataId } from './dataId'

describe('dataId', function () {
    it('validDataId', function () {
        expect(validDataId(Number.MAX_SAFE_INTEGER)).toBe(Number.MAX_SAFE_INTEGER)
        expect(validDataId(Number.MAX_SAFE_INTEGER + 1)).toBe(Number.MAX_SAFE_INTEGER + 1)
        expect(() => validDataId(-1)).toThrowError(/bad id/)
        expect(() => validDataId(1.2)).toThrowError(/bad id/)
    })

    it('generateIds', function () {
        expect(generateIds(5)).toEqual([0, 1, 2, 3, 4])
        expect(generateIds(5, 0)).toEqual([1, 2, 3, 4, 5])
        expect(generateIds(5, 2)).toEqual([3, 4, 5, 6, 7])
        expect(generateIds(0, 2)).toEqual([])
        expect(() => generateIds(-1, 2)).toThrowError(/bad count/)
        expect(() => generateIds(5, -2)).toThrowError(/bad id/)
    })
})
