import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { assert, runTestCases } from '../test'

describe('test utils', () => {
  describe('assert', () => {
    it('should not throw error when condition is true', () => {
      expect(() => assert(true)).not.toThrow()
    })

    it('should throw error when condition is false', () => {
      expect(() => assert(false)).toThrow('Assert failed')
    })

    it('should throw error with custom message', () => {
      expect(() => assert(false, 'Custom error')).toThrow('Custom error')
    })
  })

  describe('runTestCases', () => {
    let consoleLog: any

    beforeEach(() => {
      consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      consoleLog.mockRestore()
    })

    it('should run test cases and report results', () => {
      const testCases = [
        { name: 'test1', test: () => true },
        { name: 'test2', test: () => true }
      ]

      expect(() => runTestCases(testCases, 'Test Suite')).not.toThrow()
      expect(consoleLog).toHaveBeenCalledWith(expect.stringContaining('Results: 2 passed, 0 failed'))
    })

    it('should handle failed tests', () => {
      const testCases = [
        { name: 'test1', test: () => true },
        { name: 'test2', test: () => false }
      ]

      expect(() => runTestCases(testCases)).toThrow('1 test(s) failed')
      expect(consoleLog).toHaveBeenCalledWith(expect.stringContaining('✗ test2'))
    })

    it('should handle test errors', () => {
      const testCases = [
        { name: 'test1', test: () => { throw new Error('Test error') } }
      ]

      expect(() => runTestCases(testCases)).toThrow('1 test(s) failed')
      expect(consoleLog).toHaveBeenCalledWith(expect.stringContaining('✗ test1 (Error: Error: Test error)'))
    })
  })
}) 