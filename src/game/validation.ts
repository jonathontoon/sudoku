import { UNITS } from "../core/constants";
import { parseGrid, SudokuValues, SudokuGrid } from "../core/parser";

/**
 * Validation functions for Sudoku puzzles
 */

export interface Conflict {
  unit: string[];
  errorFields: string[];
}

/**
 * Find conflicts in the current puzzle state
 */
export function getConflicts(values: SudokuValues): Conflict[] {
  const errors: Conflict[] = [];
  const reportedConflicts: Record<string, boolean> = {}; // Track already reported conflicts

  for (const key in values) {
    const value = values[key] + "";
    if (!value || value.length > 1) {
      continue;
    }

    for (let i = 0; i < UNITS[key].length; i++) {
      const unit = UNITS[key][i];
      for (let j = 0; j < unit.length; j++) {
        const otherKey = unit[j];
        const otherValue = values[otherKey] + "";

        if (otherKey !== key && value === otherValue) {
          // Create a consistent conflict key to avoid duplicates
          const conflictKey = key < otherKey ? key + "-" + otherKey : otherKey + "-" + key;

          if (!reportedConflicts[conflictKey]) {
            errors.push({
              unit: unit,
              errorFields: [key, otherKey],
            });
            reportedConflicts[conflictKey] = true;
          }
        }
      }
    }
  }
  return errors;
}

/**
 * Check if the puzzle is completely solved
 */
export function isSolved(values: SudokuValues): boolean {
  for (const s in values) {
    if (values[s].length > 1) {
      return false;
    }
  }
  return true;
}

/**
 * Check if the puzzle can be solved using basic elimination only
 */
export function isSolvableWithElimination(grid: SudokuGrid): boolean {
  const parsed = parseGrid(grid);
  return parsed ? isSolved(parsed) : false;
}
