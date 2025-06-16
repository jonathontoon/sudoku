/**
 * Type definitions for Sudoku grid operations
 */

/** Represents a mapping of square positions to their possible values */
export type Values = Record<string, string>;

/** Represents a mapping of square positions to their unit lists */
export type Units = Record<string, string[][]>;

/** Represents a mapping of square positions to their peer squares */
export type Peers = Record<string, string[]>;

/** Represents the result of a constraint propagation operation */
export type ConstraintResult = [Values | false, boolean]; 