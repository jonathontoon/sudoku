import { solve } from "../core/solver";
import { DIGITS, UNITS, PEERS } from "../core/constants";
import { SudokuValues, SudokuGrid } from "../core/parser";
import { randomElement, all, chars, contains } from "../utils";

/**
 * Hint generation for Sudoku puzzles
 */

export interface ErrorHint {
  type: "error";
  square: string;
}

export interface SquareHint {
  type: "squarehint";
  square: string;
}

export interface UnitHint {
  type: "unithint";
  unitType: "row" | "column" | "box";
  unit: string[];
  digit: string;
}

export interface UnknownHint {
  type: "dontknow";
  squares: SudokuValues;
}

export type Hint = ErrorHint | SquareHint | UnitHint | UnknownHint;

/**
 * Generate a hint for the current puzzle state
 */
export function getHint(puzzle: SudokuGrid, values: SudokuValues): Hint {
  if (!values) {
    throw new Error("Values must be sent in");
  }

  const solved = solve(puzzle);
  if (!solved) {
    throw new Error("Puzzle cannot be solved");
  }

  const errorSquares: string[] = [];
  // 1. Check if there are any wrong fields, hint about those first
  for (const s in values) {
    const guess = values[s];
    if (guess && guess !== solved[s]) {
      errorSquares.push(s);
    }
  }

  if (errorSquares.length > 0) {
    return {
      type: "error",
      square: randomElement(errorSquares),
    };
  }

  // 2. Find a field that has only one possibility and give a hint about that
  const elimValues: SudokuValues = {};
  for (const s in solved) {
    elimValues[s] = DIGITS;
  }

  // One round of elimination only
  for (const s in values) {
    elimValues[s] = values[s];
    const digit = values[s];
    if (digit && digit.length === 1) {
      // Eliminate this digit from peers
      for (let i = 0; i < PEERS[s].length; i++) {
        const elimSquare = PEERS[s][i];
        elimValues[elimSquare] = elimValues[elimSquare].replace(digit, "");
      }
    }
  }

  const hintSquares: string[] = [];
  for (const s in elimValues) {
    if (elimValues[s].length === 1 && !values[s]) {
      hintSquares.push(s);
    }
  }

  if (hintSquares.length > 0) {
    return {
      type: "squarehint",
      square: randomElement(hintSquares),
    };
  }

  const unitHints: UnitHint[] = [];
  // 3. Is there a unit where one digit is only a possibility in one square?
  for (const s in elimValues) {
    const value = elimValues[s];
    if (value.length === 1) {
      continue;
    }

    const units = UNITS[s];
    for (let i = 0; i < value.length; i++) {
      const d = value.charAt(i);
      for (let u = 0; u < units.length; u++) {
        const unit = units[u];
        if (
          all(unit, (s2) => {
            return s2 === s || !contains(chars(elimValues[s2]), d);
          })
        ) {
          let unitType: "row" | "column" | "box" = "box";
          if (unit[0].charAt(0) === unit[8].charAt(0)) {
            unitType = "row";
          } else if (unit[0].charAt(1) === unit[8].charAt(1)) {
            unitType = "column";
          }

          unitHints.push({
            type: "unithint",
            unitType: unitType,
            unit: unit,
            digit: d,
          });
        }
      }
    }
  }

  if (unitHints.length > 0) {
    return randomElement(unitHints);
  }

  return {
    type: "dontknow",
    squares: elimValues,
  };
}
