import { SQUARES, PEERS, UNITS } from "./constants";
import { parseGrid, gridValues, SudokuValues, SudokuGrid } from "./parser";
import { all, some, filter, chars, shuffle, copy, randomElement } from "../utils";

/**
 * Core Sudoku solving algorithms
 */

export interface SolverOptions {
  chooseDigit?: "min" | "max" | "random";
  chooseSquare?: "minDigits" | "maxDigits" | "random";
}

/**
 * Eliminate all the other values (except d) from values[s] and propagate.
 * Return values, except return false if a contradiction is detected.
 */
export function assign(values: SudokuValues, s: string, d: string): SudokuValues | false {
  const otherValues = values[s].replace(d, "");
  if (all(chars(otherValues), (d2) => !!eliminate(values, s, d2))) {
    return values;
  } else {
    return false;
  }
}

/**
 * Eliminate d from values[s]; propagate when values or places <= 2.
 * Return values, except return false if a contradiction is detected.
 */
export function eliminate(values: SudokuValues, s: string, d: string): SudokuValues | false {
  if (values[s].indexOf(d) === -1) {
    return values; // Already eliminated
  }

  values[s] = values[s].replace(d, "");

  // (1) If a square s is reduced to one value d2, then eliminate d2 from the peers.
  if (values[s].length === 0) {
    return false; // Contradiction: removed last value
  } else if (values[s].length === 1) {
    const d2 = values[s];
    if (!all(PEERS[s], (s2) => !!eliminate(values, s2, d2))) {
      return false;
    }
  }

  // (2) If a unit u is reduced to only one place for a value d, then put it there.
  for (let i = 0; i < UNITS[s].length; i++) {
    const u = UNITS[s][i];
    const dplaces = filter(u, (s2) => values[s2].indexOf(d) !== -1);
    if (dplaces.length === 0) {
      return false; // Contradiction: no place for this value
    } else if (dplaces.length === 1) {
      // d can only be in one place in unit; assign it there
      if (!assign(values, dplaces[0], d)) {
        return false;
      }
    }
  }

  return values;
}

/**
 * Using depth-first search and propagation, try all possible values.
 */
export function search(
  values: SudokuValues | false,
  options: SolverOptions = {}
): SudokuValues | false {
  const opts = {
    chooseDigit: options.chooseDigit || ("random" as const),
    chooseSquare: options.chooseSquare || ("minDigits" as const),
  };

  // Failed earlier
  if (values === false) {
    return false;
  }

  // Solved!
  if (all(SQUARES, (s) => values[s].length === 1)) {
    return values;
  }

  // Choose the unfilled square s with the fewest possibilities
  const candidates = filter(SQUARES, (s) => values[s].length > 1);
  candidates.sort((s1, s2) => {
    if (values[s1].length !== values[s2].length) {
      return values[s1].length - values[s2].length;
    }
    if (s1 < s2) {
      return -1;
    } else {
      return 1;
    }
  });

  let s: string;
  if (opts.chooseSquare === "minDigits") {
    s = candidates[0];
  } else if (opts.chooseSquare === "maxDigits") {
    s = candidates[candidates.length - 1];
  } else if (opts.chooseSquare === "random") {
    s = randomElement(candidates);
  } else {
    s = candidates[0];
  }

  let digitsLeft = chars(values[s]);
  if (opts.chooseDigit === "max") {
    digitsLeft.reverse();
  } else if (opts.chooseDigit === "random") {
    digitsLeft = shuffle(digitsLeft);
  }

  return some(digitsLeft, (d) => search(assign(copy(values), s, d), options));
}

/**
 * Main solve function - entry point for solving Sudoku puzzles
 */
export function solve(grid: SudokuGrid, options?: SolverOptions): SudokuValues | false {
  return search(parseGrid(grid, assign), options);
}
