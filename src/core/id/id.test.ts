import { describe, expect, it } from 'vitest'
import { getFirstId, nextId, validId } from './id'

describe('id', function () {
    it('getFirstId() starts from a single character', function () {
        expect(getFirstId()).toHaveLength(1)
    })
    it('getFirstId() should always starts from the same character', function () {
        expect(getFirstId()).toBe(getFirstId())
    })

    it('validId', function () {
        expect(() => validId('')).toThrowError(/bad id/)
        expect(() => validId('_')).toThrowError(/bad id/)
    })

    it('nextId() generate one character up on currentId', function () {
        expect(nextId('a')).toBe('b')
        expect(nextId('aa')).toBe('ab')
        expect(nextId('aZ')).toBe('b0')
        expect(nextId('daZ')).toBe('db0')
        expect(nextId('Z')).toBe('00')
        expect(nextId('ZZ')).toBe('000')
        expect(() => nextId('_')).toThrowError(/bad id/)
    })
})
