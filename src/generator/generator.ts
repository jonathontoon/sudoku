import { solve } from "../core/solver";
import { SQUARES } from "../core/constants";
import { SudokuValues } from "../core/parser";
import { isSolvableWithElimination } from "../game/validation";
import { copy, shuffle, keys } from "../utils";
import { debug } from "../utils/debug";
import { squareCount, Difficulty } from "./difficulty";
import { isUnique } from "./uniqueness";

/**
 * Puzzle generation functionality
 */

export interface GenerationResult {
  puzzle: SudokuValues;
  difficulty: Difficulty;
  filledSquares: number;
  generationTime: number;
}

/**
 * Generate a new Sudoku puzzle with the specified difficulty
 */
export function generate(difficulty: Difficulty = "easy"): SudokuValues {
  const start = Date.now();
  const minSquares = squareCount(difficulty);

  // Start with a complete solved grid
  const fullGrid = solve({});
  if (!fullGrid) {
    throw new Error("Failed to generate a complete grid");
  }

  let generatedGrid = copy(fullGrid);
  const shuffledSquares = shuffle([...SQUARES]);
  let filledSquares = shuffledSquares.length;

  // Remove squares one by one while maintaining uniqueness
  for (let i = 0; i < shuffledSquares.length; i++) {
    const s = shuffledSquares[i];

    // Try removing this square
    const originalValue = generatedGrid[s];
    delete generatedGrid[s];
    filledSquares--;

    // Check if puzzle is still valid and unique
    try {
      if (!isUnique(generatedGrid)) {
        // Restore the square if removing it breaks uniqueness
        generatedGrid[s] = originalValue;
        filledSquares++;
      }
    } catch (error) {
      // If we can't solve it, restore the square
      generatedGrid[s] = originalValue;
      filledSquares++;
    }

    // Stop if we've reached the target number of squares
    if (filledSquares <= minSquares) {
      break;
    }
  }

  const time = Date.now() - start;
  debug(`Generated puzzle with ${keys(generatedGrid).length} squares in ${time}ms`);

  return generatedGrid;
}

/**
 * Generate a puzzle with detailed result information
 */
export function generateWithStats(difficulty: Difficulty = "easy"): GenerationResult {
  const start = Date.now();
  const puzzle = generate(difficulty);
  const generationTime = Date.now() - start;

  return {
    puzzle,
    difficulty,
    filledSquares: keys(puzzle).length,
    generationTime,
  };
}
