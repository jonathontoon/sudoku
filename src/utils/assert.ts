/**
 * Simple assertion utility matching the original sudoku.js implementation
 */

/**
 * Assert that a condition is true, throw Error if false
 * Matches the behavior of the original sudoku.js assert function
 */
export function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw Error(message || "Assert failed");
  }
}
