import { solve } from "../core/solver";
import { gridValues, SudokuGrid, SudokuValues } from "../core/parser";

/**
 * Uniqueness checking for puzzle generation
 */

/**
 * Check if a puzzle has a unique solution
 */
export function isUnique(grid: SudokuGrid): boolean {
  const input = typeof grid === "string" ? gridValues(grid) : grid;

  // Solve with different digit selection strategies
  const solved1 = solve(input, { chooseDigit: "min" });
  const solved2 = solve(input, { chooseDigit: "max" });

  if (!solved1 || !solved2) {
    throw new Error("Failed to solve puzzle");
  }

  // Compare solutions - if they differ, puzzle has multiple solutions
  for (const s in solved1) {
    if (solved2[s] !== solved1[s]) {
      return false;
    }
  }
  return true;
}
