import { Values, ConstraintResult } from '../types/grid';
import { digits, squares, parseGridValues, unitlist } from './grid';
import { units, peers } from './validator';
import { copy, all, some, filter, shuffled } from '../utils/array';
import { chars } from '../utils/string';

/**
 * Convert grid to a dict of possible values, {square: digits}, or
 * return false if a contradiction is detected.
 */
export const parseGrid = (grid: string): Values | false => {
  // To start, every square can be any digit
  const values: Values = {};
  squares.forEach(s => {
    values[s] = digits;
  });

  // Then assign values from the grid
  const gridValues = parseGridValues(grid);
  for (const [s, d] of Object.entries(gridValues)) {
    if (digits.includes(d) && !assign(values, s, d)) {
      return false; // Contradiction
    }
  }

  return values;
};

/**
 * Eliminate all the other values (except d) from values[s] and propagate.
 * Return values, except return false if a contradiction is detected.
 */
export const assign = (values: Values, s: string, d: string): Values | false => {
  const otherValues = values[s].replace(d, "");
  if (all(chars(otherValues), (d2: string) => eliminate(values, s, d2) !== false)) {
    return values;
  }
  return false;
};

/**
 * Eliminate d from values[s]; propagate when values or places <= 2.
 * Return values, except return false if a contradiction is detected.
 */
export const eliminate = (values: Values, s: string, d: string): Values | false => {
  if (!values[s].includes(d)) {
    return values; // Already eliminated
  }

  values[s] = values[s].replace(d, "");

  // (1) If a square s is reduced to one value d2, then eliminate d2 from the peers
  if (values[s].length === 0) {
    return false; // Contradiction: removed last value
  } else if (values[s].length === 1) {
    const d2 = values[s];
    if (!all(peers[s], (s2: string) => eliminate(values, s2, d2) !== false)) {
      return false;
    }
  }

  // (2) If a unit u is reduced to only one place for a value d, then put it there
  for (const u of units[s]) {
    const dplaces = filter(u, (s2: string) => values[s2].includes(d));
    if (dplaces.length === 0) {
      return false; // Contradiction: no place for this value
    } else if (dplaces.length === 1) {
      if (!assign(values, dplaces[0], d)) {
        return false;
      }
    }
  }

  return values;
};

/**
 * Using depth-first search and propagation, try all possible values.
 */
export const search = (values: Values | false): Values | false => {
  if (values === false) {
    return false; // Failed earlier
  }
  if (all(squares, (s: string) => values[s].length === 1)) {
    return values; // Solved!
  }

  // Choose the unfilled square s with the fewest possibilities
  const unfilled = filter(squares, (s: string) => values[s].length > 1);
  const [s] = unfilled.sort((a, b) => values[a].length - values[b].length);

  // Try each possible value in the chosen square
  return some(chars(values[s]), (d: string) => search(assign(copy(values), s, d)));
};

/**
 * Apply basic constraint propagation to eliminate values
 */
const applyBasicConstraints = (values: Values): ConstraintResult => {
  let progress = false;
  let result: Values | false = values;

  // Apply each constraint propagation technique
  const techniques = [findHiddenSingles, findNakedPairs, findHiddenPairs];
  
  for (const technique of techniques) {
    const [newValues, madeProgress] = technique(result || {});
    if (newValues === false) return [false, progress];
    if (madeProgress) {
      progress = true;
      result = newValues;
    }
  }

  return [result, progress];
};

/**
 * Find hidden singles in units
 */
const findHiddenSingles = (values: Values): ConstraintResult => {
  let progress = false;
  let result: Values | false = values;

  for (const unit of unitlist) {
    for (const d of digits) {
      const places = unit.filter(s => values[s].includes(d));
      if (places.length === 1 && values[places[0]].length > 1) {
        result = assign(result || {}, places[0], d);
        if (result === false) return [false, progress];
        progress = true;
      }
    }
  }

  return [result, progress];
};

/**
 * Find naked pairs in units
 */
const findNakedPairs = (values: Values): ConstraintResult => {
  let progress = false;
  let result = values;

  for (const unit of unitlist) {
    const pairs = unit.filter(s => values[s].length === 2);
    for (let i = 0; i < pairs.length; i++) {
      for (let j = i + 1; j < pairs.length; j++) {
        if (values[pairs[i]] === values[pairs[j]]) {
          const digits = values[pairs[i]].split('');
          const otherSquares = unit.filter(s => s !== pairs[i] && s !== pairs[j]);
          for (const d of digits) {
            for (const s of otherSquares) {
              if (values[s].includes(d)) {
                result = { ...result };
                result[s] = values[s].replace(d, '');
                progress = true;
              }
            }
          }
        }
      }
    }
  }

  return [result, progress];
};

/**
 * Find hidden pairs in units
 */
const findHiddenPairs = (values: Values): ConstraintResult => {
  let progress = false;
  let result = values;

  for (const unit of unitlist) {
    const digitPlaces = digits.split('').map(d => ({
      digit: d,
      places: unit.filter(s => values[s].includes(d))
    }));

    for (let i = 0; i < digitPlaces.length; i++) {
      for (let j = i + 1; j < digitPlaces.length; j++) {
        const places1 = digitPlaces[i].places;
        const places2 = digitPlaces[j].places;
        
        if (places1.length === 2 && places2.length === 2 &&
            places1[0] === places2[0] && places1[1] === places2[1]) {
          const d1 = digitPlaces[i].digit;
          const d2 = digitPlaces[j].digit;
          
          for (const s of places1) {
            if (values[s].length > 2) {
              result = { ...result };
              result[s] = d1 + d2;
              progress = true;
            }
          }
        }
      }
    }
  }

  return [result, progress];
};

/**
 * Solve a Sudoku grid
 */
export const solve = (grid: string): Values | false => search(parseGrid(grid));

/**
 * Generate a random puzzle with N givens.
 * The resulting puzzle is guaranteed to be solvable and have exactly one solution.
 */
export const randomPuzzle = (N: number = 17): string => {
  // Start with a solved puzzle
  const values = solve(Array(81).fill('.').join(''));
  if (!values) return Array(81).fill('.').join(''); // Should never happen

  // Convert the solved puzzle to a string
  const solvedPuzzle = squares.map(s => values[s]).join('');
  
  // Remove values while maintaining uniqueness
  const positions = shuffled(squares);
  let puzzle = solvedPuzzle;
  
  for (const p of positions) {
    const i = squares.indexOf(p);
    const digit = puzzle[i];
    const newPuzzle = puzzle.substring(0, i) + '.' + puzzle.substring(i + 1);
    
    // If removing the digit creates multiple solutions or no solution, put it back
    const solutions = countSolutions(newPuzzle);
    if (solutions === 1) {
      puzzle = newPuzzle;
    }
    
    // Stop if we've reached the target number of givens
    if (puzzle.split('').filter(c => c !== '.').length <= N) {
      break;
    }
  }

  return puzzle;
};

/**
 * Count the number of solutions for a given grid.
 * Returns the count up to 2 (to check for uniqueness).
 */
export const countSolutions = (grid: string): number => {
  let count = 0;
  const values = parseGrid(grid);
  if (!values) return 0;

  const recurse = (vals: Values): void => {
    if (count >= 2) return; // Stop if we've found more than one solution
    if (squares.every((s: string) => vals[s].length === 1)) {
      count++; // Found a solution
      return;
    }

    // Choose the unfilled square s with the fewest possibilities
    const unfilled = filter(squares, (s: string) => vals[s].length > 1);
    const [s] = unfilled.sort((a, b) => vals[a].length - vals[b].length);

    // Try each possible value
    for (const d of vals[s]) {
      const newVals = assign(copy(vals), s, d);
      if (newVals) recurse(newVals);
    }
  };

  recurse(values);
  return count;
}; 