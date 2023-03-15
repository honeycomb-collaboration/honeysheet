import { describe, expect, it } from 'vitest'
import { getFirstDataId, nextDataId, validDataId } from './dataId'

describe('id', function () {
    it('getFirstDataId() starts from a single character', function () {
        expect(getFirstDataId()).toHaveLength(1)
    })
    it('getFirstDataId() should always starts from the same character', function () {
        expect(getFirstDataId()).toBe(getFirstDataId())
    })

    it('validDataId', function () {
        expect(() => validDataId('')).toThrowError(/bad id/)
        expect(() => validDataId('_')).toThrowError(/bad id/)
    })

    it('nextDataId() generate one character up on currentId', function () {
        expect(nextDataId('a')).toBe('b')
        expect(nextDataId('aa')).toBe('ab')
        expect(nextDataId('aZ')).toBe('b0')
        expect(nextDataId('daZ')).toBe('db0')
        expect(nextDataId('Z')).toBe('00')
        expect(nextDataId('ZZ')).toBe('000')
        expect(() => nextDataId('_')).toThrowError(/bad id/)
    })
})
