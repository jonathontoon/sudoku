import { assertType, expectTypeOf, test } from 'vitest'
import type { Values, Units, Peers, ConstraintResult } from '../grid'

test('Values type', () => {
  // Should be a record of string to string
  type TestValues = Values
  expectTypeOf<TestValues>().toEqualTypeOf<Record<string, string>>()

  const testValues = {
    'A1': '123',
    'B2': '456'
  }
  assertType<Values>(testValues)

  const invalidValues = { 'A1': 123 }
  // @ts-expect-error Values must have string values
  assertType<Values>(invalidValues)
})

test('Units type', () => {
  // Should be a record of string to array of string arrays
  type TestUnits = Units
  expectTypeOf<TestUnits>().toEqualTypeOf<Record<string, string[][]>>()

  const testUnits = {
    'A1': [['A1', 'A2', 'A3'], ['A1', 'B1', 'C1']]
  }
  assertType<Units>(testUnits)

  const invalidUnits = { 'A1': ['A1', 'A2'] }
  // @ts-expect-error Units must have array of string arrays
  assertType<Units>(invalidUnits)
})

test('Peers type', () => {
  // Should be a record of string to string array
  type TestPeers = Peers
  expectTypeOf<TestPeers>().toEqualTypeOf<Record<string, string[]>>()

  const testPeers = {
    'A1': ['A2', 'A3', 'B1', 'C1']
  }
  assertType<Peers>(testPeers)

  const invalidPeers = { 'A1': [1, 2, 3] }
  // @ts-expect-error Peers must have string array values
  assertType<Peers>(invalidPeers)
})

test('ConstraintResult type', () => {
  // Should be a tuple of Values|false and boolean
  type TestConstraintResult = ConstraintResult
  expectTypeOf<TestConstraintResult>().toEqualTypeOf<[Values | false, boolean]>()

  const validResult: ConstraintResult = [{ 'A1': '123' }, true]
  assertType<ConstraintResult>(validResult)

  const invalidResult: ConstraintResult = [false, false]
  assertType<ConstraintResult>(invalidResult)

  const invalidFirstElement = ['invalid', true]
  // @ts-expect-error First element must be Values or false
  assertType<ConstraintResult>(invalidFirstElement)

  const invalidSecondElement = [{ 'A1': '123' }, 'true']
  // @ts-expect-error Second element must be boolean
  assertType<ConstraintResult>(invalidSecondElement)

  const invalidLength = [{ 'A1': '123' }, true, 'extra']
  // @ts-expect-error Must have exactly two elements
  assertType<ConstraintResult>(invalidLength)
}) 