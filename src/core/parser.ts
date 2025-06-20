import { SQUARES, DIGITS } from "./constants";
import { each, contains, chars, assert } from "../utils";

/**
 * Grid parsing and conversion functions
 */

export type SudokuValues = Record<string, string>;
export type SudokuGrid = Record<string, string> | string;

/**
 * Convert grid into a dict of {square: char} with '0' or '.' for empties.
 */
export function gridValues(grid: string): SudokuValues {
  // Remove all non-digit and non-dot characters
  const cleanGrid = grid.replace(/[^0-9\.]/g, "");

  // Assert grid length matches original sudoku.js behavior
  assert(cleanGrid.length === 81, `Grid must be exactly 81 characters, got ${cleanGrid.length}`);

  const input: SudokuValues = {};

  for (let i = 0; i < SQUARES.length; i++) {
    const val = cleanGrid[i];
    if (contains(chars(DIGITS), val)) {
      input[SQUARES[i]] = val;
    }
  }

  return input;
}

/**
 * Convert grid to a dict of possible values, {square: digits}, or
 * return false if a contradiction is detected
 */
export function parseGrid(
  grid: SudokuGrid,
  assignFn?: (values: SudokuValues, s: string, d: string) => SudokuValues | false
): SudokuValues | false {
  // To start, every square can be any digit; then assign values from the grid.
  const values: SudokuValues = {};
  each(SQUARES, (_, s) => {
    values[s] = DIGITS;
  });

  const input = typeof grid === "string" ? gridValues(grid) : grid;

  for (const s in input) {
    const d = input[s];
    if (d && contains(chars(DIGITS), d)) {
      if (assignFn) {
        if (!assignFn(values, s, d)) {
          return false; // Fail if we can't assign d to square s
        }
      } else {
        // Simple assignment without constraint propagation
        values[s] = d;
      }
    }
  }

  return values;
}
