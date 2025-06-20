/**
 * Game functionality for Sudoku puzzles
 */

// Hint generation
export { getHint } from "./hints";

export type { ErrorHint, SquareHint, UnitHint, UnknownHint, Hint } from "./hints";

// Validation and conflict detection
export { getConflicts, isSolved, isSolvableWithElimination } from "./validation";

export type { Conflict } from "./validation";
