/**
 * Puzzle generation functionality for Sudoku puzzles
 */

// Difficulty configuration
export { squareCount } from "./difficulty";

export type { Difficulty } from "./difficulty";

// Uniqueness checking
export { isUnique } from "./uniqueness";

// Main generation functions
export { generate, generateWithStats } from "./generator";

export type { GenerationResult } from "./generator";
