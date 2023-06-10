import { describe, expect, it, vi } from 'vitest'
import { forEach2dArray, map2dArray } from './2dArray'

describe('map2dArray', () => {
    it('should map each item in the 2D array', () => {
        const array = [
            [1, 2],
            [3, 4],
        ]
        const mapper = (item: number) => item * 2
        const expected = [
            [2, 4],
            [6, 8],
        ]
        const result = map2dArray(array, mapper)
        expect(result).toEqual(expected)
    })

    it('should pass the row and column index to the mapper function', () => {
        const array = [
            [1, 2],
            [3, 4],
        ]
        const mapper = vi.fn((item, rowIndex, columnIndex) => item + rowIndex + columnIndex)
        map2dArray(array, mapper)
        expect(mapper).toHaveBeenCalledTimes(4)
        expect(mapper.mock.calls[0]).toEqual([1, 0, 0])
        expect(mapper.mock.calls[1]).toEqual([2, 0, 1])
        expect(mapper.mock.calls[2]).toEqual([3, 1, 0])
        expect(mapper.mock.calls[3]).toEqual([4, 1, 1])
    })
})

describe('forEach2dArray', () => {
    it('should call the callback for each item in the array', () => {
        const array = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
        ]
        const callback = vi.fn()
        forEach2dArray(array, callback)
        expect(callback).toHaveBeenCalledTimes(9)
        expect(callback).toHaveBeenNthCalledWith(1, 1, 0, 0)
        expect(callback).toHaveBeenNthCalledWith(2, 2, 0, 1)
        expect(callback).toHaveBeenNthCalledWith(3, 3, 0, 2)
        expect(callback).toHaveBeenNthCalledWith(4, 4, 1, 0)
        expect(callback).toHaveBeenNthCalledWith(5, 5, 1, 1)
        expect(callback).toHaveBeenNthCalledWith(6, 6, 1, 2)
        expect(callback).toHaveBeenNthCalledWith(7, 7, 2, 0)
        expect(callback).toHaveBeenNthCalledWith(8, 8, 2, 1)
        expect(callback).toHaveBeenNthCalledWith(9, 9, 2, 2)
    })
})
