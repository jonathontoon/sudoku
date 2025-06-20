import { SQUARES } from "./constants";
import { SudokuValues } from "./parser";

/**
 * Serialization functions for Sudoku puzzles
 */

/**
 * Serialize a Sudoku puzzle to a compressed string format
 * Uses run-length encoding for empty squares to reduce size
 */
export function serialize(values: SudokuValues): string {
  let serialized = "";

  // Build the raw string with 'x' for empty squares
  for (let i = 0; i < SQUARES.length; i++) {
    serialized += values[SQUARES[i]] || "x";
  }

  // Compress consecutive 'x' characters using run-length encoding
  serialized = serialized
    .replace(/xxxxxx/g, "f") // 6 empty squares -> 'f'
    .replace(/xxxxx/g, "e") // 5 empty squares -> 'e'
    .replace(/xxxx/g, "d") // 4 empty squares -> 'd'
    .replace(/xxx/g, "c") // 3 empty squares -> 'c'
    .replace(/xx/g, "b") // 2 empty squares -> 'b'
    .replace(/x/g, "a"); // 1 empty square -> 'a'

  return serialized;
}

/**
 * Deserialize a compressed string back to a Sudoku puzzle
 * Reverses the run-length encoding used in serialize
 */
export function deserialize(serialized: string): SudokuValues {
  const values: SudokuValues = {};

  // Decompress the run-length encoded empty squares
  const decompressed = serialized
    .replace(/f/g, "xxxxxx") // 'f' -> 6 empty squares
    .replace(/e/g, "xxxxx") // 'e' -> 5 empty squares
    .replace(/d/g, "xxxx") // 'd' -> 4 empty squares
    .replace(/c/g, "xxx") // 'c' -> 3 empty squares
    .replace(/b/g, "xx") // 'b' -> 2 empty squares
    .replace(/a/g, "x"); // 'a' -> 1 empty square

  // Convert back to values object, skipping empty squares
  for (let i = 0; i < Math.min(SQUARES.length, decompressed.length); i++) {
    const char = decompressed.charAt(i);
    if (char !== "x" && char !== "") {
      values[SQUARES[i]] = char;
    }
  }

  return values;
}
