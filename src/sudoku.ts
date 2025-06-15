import {
  dict,
  set,
  all,
  some,
  len,
  chars,
  each,
  vals,
  keys,
  copy,
  filter,
  map,
  contains,
  shuffled,
  repeat,
  center,
  assert,
} from "@utilities";

// Type definitions
export type Values = Record<string, string>;

// Constants
export const digits = "123456789";
export const rows = "ABCDEFGHI";
export const cols = digits;

/**
 * Cross product of elements in A and elements in B.
 */
export const cross = (A: string[], B: string[]): string[] => {
  const result: string[] = [];
  for (const a of A) {
    for (const b of B) {
      result.push(a + b);
    }
  }
  return result;
};

// Calculate all squares and units
export const squares = cross(chars(rows), chars(cols));
export const unitlist = [
  ...chars(cols).map((c) => cross(chars(rows), [c])),
  ...chars(rows).map((r) => cross([r], chars(cols))),
  ...["ABC", "DEF", "GHI"].map((rs) => ["123", "456", "789"].map((cs) => cross(chars(rs), chars(cs)))).flat(),
];

// Create units and peers mappings
export const units: Record<string, string[][]> = {};
each(squares, (s: string) => {
  units[s] = filter(unitlist, (u: string[]) => contains(u, s));
});

export const peers: Record<string, string[]> = {};
each(squares, (s: string) => {
  peers[s] = set(filter(units[s].flat(), (s2: string) => s2 !== s));
});

/**
 * Convert grid to a dict of possible values, {square: digits}, or
 * return false if a contradiction is detected.
 */
export const parseGrid = (grid: string): Values | false => {
  // To start, every square can be any digit
  const values: Values = {};
  each(squares, (s: string) => {
    values[s] = digits;
  });

  // Then assign values from the grid
  const gridValues = parseGridValues(grid);
  for (const s of keys(gridValues)) {
    const d = gridValues[s];
    if (digits.includes(d) && !assign(values, s, d)) {
      return false; // Contradiction
    }
  }

  return values;
};

/**
 * Convert grid into a dict of {square: char} with '0' or '.' for empties.
 */
export const parseGridValues = (grid: string): Values => {
  const chars = grid.replace(/[^0-9\.]/g, "");
  if (len(chars) !== 81) throw new Error(`Grid must be 81 characters, got ${len(chars)}: ${grid}`);
  return dict(squares, chars.split(""));
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
 * Display these values as a 2-D grid.
 */
export const display = (values: Values, toFile: boolean = false): string => {
  if (!values || typeof values !== 'object') {
    const msg = "Invalid grid state";
    if (toFile) return msg + "\n";
    console.log(msg);
    return msg;
  }

  const lengths = map(vals(values), (v: string) => v?.length || 0);
  if (lengths.length === 0) {
    const msg = "Empty grid state";
    if (toFile) return msg + "\n";
    console.log(msg);
    return msg;
  }

  const width = 1 + Math.max(...lengths);
  const line = repeat("-".repeat(width * 3), 3)
    .split("")
    .join("+");

  const output: string[] = [];
  
  for (const r of rows) {
    const row = chars(cols)
      .map((c) => {
        const val = center(values[r + c] || "", width);
        return c === "3" || c === "6" ? val + "|" : val;
      })
      .join("");
    output.push(row);
    if ("CF".includes(r)) output.push(line);
  }
  output.push("");  // Add blank line at end

  const result = output.join("\n");
  if (!toFile) {
    console.log(result);
  }
  return result;
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
 * A puzzle is solved if each unit is a permutation of the digits 1 to 9.
 */
export const solved = (values: Values | false): boolean => {
  if (!values) return false;
  const unitSolved = (unit: string[]): boolean => {
    const udigits = map(unit, (s: string) => values[s]);
    udigits.sort();
    return udigits.join("") === digits;
  };
  return all(unitlist, unitSolved);
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
    if (all(squares, (s: string) => vals[s].length === 1)) {
      count++; // Found a solution
      return;
    }

    // Choose the unfilled square s with the fewest possibilities
    const unfilled = filter(squares, (s: string) => vals[s].length > 1);
    const [s] = unfilled.sort((a, b) => vals[a].length - vals[b].length);

    // Try each possible value
    for (const d of chars(vals[s])) {
      const newVals = assign(copy(vals), s, d);
      if (newVals) recurse(newVals);
    }
  };

  recurse(values);
  return count;
};

/**
 * Check if a puzzle can be solved through logical deduction alone,
 * without requiring trial and error.
 */
export const isLogicallySolvable = (grid: string): boolean => {
  const values = parseGrid(grid);
  if (!values) return false;

  let progress = true;
  while (progress) {
    progress = false;
    
    // Count current assignments
    const before = filter(squares, (s) => values[s].length === 1).length;
    
    // Apply logical deduction rules
    for (const s of squares) {
      if (values[s].length === 1) continue; // Already solved
      
      // Try each possible value
      for (const d of chars(values[s])) {
        const newVals = assign(copy(values), s, d);
        if (!newVals) {
          // If assigning d leads to contradiction, eliminate it
          if (!eliminate(values, s, d)) return false;
          progress = true;
        }
      }
    }
    
    // Check if we made any progress
    const after = filter(squares, (s) => values[s].length === 1).length;
    if (after > before) progress = true;
  }

  // Check if puzzle is solved
  return all(squares, (s) => values[s].length === 1);
};

/**
 * Make a random puzzle that is both uniquely solvable and can be solved
 * through logical deduction alone.
 */
export const randomPuzzle = (N = 17): string => {
  // Start with a solved grid
  const values: Values = {};
  each(squares, (s: string) => {
    values[s] = digits;
  });

  // Fill in random values to create a solved grid
  for (const s of shuffled(squares)) {
    if (values[s].length > 1) {
      const d = values[s][Math.floor(Math.random() * values[s].length)];
      if (!assign(values, s, d)) {
        return randomPuzzle(N); // Start over if we hit a contradiction
      }
    }
  }

  // Convert to string format
  const solvedGrid = map(squares, (s) => values[s]).join("");
  
  // Remove values while maintaining unique solution and logical solvability
  const puzzle = [...solvedGrid];
  for (const s of shuffled(squares)) {
    const temp = puzzle[squares.indexOf(s)];
    puzzle[squares.indexOf(s)] = ".";
    const grid = puzzle.join("");
    
    // Check if removing this value maintains our constraints
    if (countSolutions(grid) !== 1 || !isLogicallySolvable(grid)) {
      puzzle[squares.indexOf(s)] = temp; // Put it back
    }
    
    // Stop if we've reached our target number of clues
    const clues = puzzle.filter(c => c !== ".").length;
    if (clues <= N) break;
  }

  return puzzle.join("");
};

// Main solver function
export const solve = (grid: string): Values | false => search(parseGrid(grid)); 