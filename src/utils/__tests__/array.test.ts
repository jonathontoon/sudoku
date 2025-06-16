import { describe, it, expect } from 'vitest'
import { all, copy, filter, set, some, range, shuffled } from '../array'

describe('array utils', () => {
  describe('all', () => {
    it('should return true when all elements satisfy the predicate', () => {
      expect(all([2, 4, 6, 8], (x) => x % 2 === 0)).toBe(true)
    })

    it('should return false when any element fails the predicate', () => {
      expect(all([2, 4, 5, 8], (x) => x % 2 === 0)).toBe(false)
    })

    it('should return true for empty array', () => {
      expect(all([], () => false)).toBe(true)
    })
  })

  describe('copy', () => {
    it('should create a shallow copy of an object', () => {
      const original = { a: 1, b: 2 }
      const copied = copy(original)
      expect(copied).toEqual(original)
      expect(copied).not.toBe(original)
    })
  })

  describe('filter', () => {
    it('should filter array elements based on predicate', () => {
      expect(filter([1, 2, 3, 4], (x) => x % 2 === 0)).toEqual([2, 4])
    })

    it('should return empty array when no elements match', () => {
      expect(filter([1, 3, 5], (x) => x % 2 === 0)).toEqual([])
    })
  })

  describe('set', () => {
    it('should create a unique array', () => {
      expect(set([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3])
    })

    it('should preserve order of first occurrence', () => {
      expect(set([3, 2, 1, 2, 3])).toEqual([3, 2, 1])
    })
  })

  describe('some', () => {
    it('should return result when an element satisfies predicate', () => {
      expect(some([1, 2, 3], (x) => x === 2 ? 'found' : false)).toBe('found')
    })

    it('should return false when no elements satisfy predicate', () => {
      expect(some([1, 2, 3], (x) => x > 5 ? true : false)).toBe(false)
    })
  })

  describe('range', () => {
    it('should generate a range of numbers', () => {
      expect(range(0, 3)).toEqual([0, 1, 2])
    })

    it('should return empty array for invalid range', () => {
      expect(range(3, 0)).toEqual([])
    })
  })

  describe('shuffled', () => {
    it('should return array with same elements', () => {
      const original = [1, 2, 3, 4, 5]
      const result = shuffled(original)
      expect(result.sort()).toEqual(original.sort())
    })

    it('should not modify original array', () => {
      const original = [1, 2, 3]
      const originalCopy = [...original]
      shuffled(original)
      expect(original).toEqual(originalCopy)
    })
  })
}) 