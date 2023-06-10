import { describe, expect, it } from 'vitest'
import { createUniqueID } from './randomId'

describe('randomId', function () {
    it('createUniqueID()', function () {
        expect(createUniqueID('abc').startsWith('abc'))
        expect(createUniqueID('abc')).not.toEqual(createUniqueID('abc'))
    })
})
