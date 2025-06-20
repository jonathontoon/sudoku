/**
 * Sudoku Library - TypeScript Implementation
 *
 * This library contains a solver, generator, serialization of puzzles
 * and methods to get conflicts and hints for puzzles that are in progress.
 *
 * Based on Peter Norvig's excellent Sudoku solver and Einar Egilsson's JavaScript implementation.
 */

// Main API - Core functionality that users actually need
export { solve } from "./core/solver";
export { getConflicts } from "./game/validation";
export { getHint } from "./game/hints";
export { isUnique } from "./generator/uniqueness";
export { generate } from "./generator/generator";
export { serialize, deserialize } from "./core/serialization";

// Optional: Keep these legacy exports for backward compatibility if needed
// export { parseGrid as test } from './core/parser';
// export { UNITLIST as unitList } from './core/constants';
// export { debugEnabled as debug, setDebugEnabled } from './utils/debug';
