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
  range,
  repeat,
  center,
  filter,
  map,
  contains,
  shuffled,
  open,
  create,
  append,
} from "@utilities";

// Throughout this program we have:
//   r is a row,    e.g. 'A'
//   c is a column, e.g. '3'
//   s is a square, e.g. 'A3'
//   d is a digit,  e.g. '9'
//   u is a unit,   e.g. ['A1','B1','C1','D1','E1','F1','G1','H1','I1']
//   grid is a grid,e.g. 81 non-blank chars, e.g. starting with '.18...7...
//   values is a dict of possible values, e.g. {'A1':'12349', 'A2':'8', ...}

type Values = Record<string, string>;

/**
 * Assert that a condition is true, throw an error if it's false.
 */
const assert = (val: boolean, message?: string): void => {
  if (!val) {
    throw new Error(message || "Assert failed");
  }
};

const digits = "123456789";
const rows = "ABCDEFGHI";
const cols = digits;

/**
 * Cross product of elements in A and elements in B.
 */
const cross = (A: string[], B: string[]): string[] => {
  const result: string[] = [];
  for (const a of A) {
    for (const b of B) {
      result.push(a + b);
    }
  }
  return result;
};

// Calculate all squares and units
const squares = cross(chars(rows), chars(cols));
const unitlist = [
  ...chars(cols).map((c) => cross(chars(rows), [c])),
  ...chars(rows).map((r) => cross([r], chars(cols))),
  ...["ABC", "DEF", "GHI"].map((rs) => ["123", "456", "789"].map((cs) => cross(chars(rs), chars(cs)))).flat(),
];

// Create units and peers mappings
const units: Record<string, string[][]> = {};
each(squares, (s: string) => {
  units[s] = filter(unitlist, (u: string[]) => contains(u, s));
});

const peers: Record<string, string[]> = {};
each(squares, (s: string) => {
  peers[s] = set(filter(units[s].flat(), (s2: string) => s2 !== s));
});

/**
 * Convert grid to a dict of possible values, {square: digits}, or
 * return false if a contradiction is detected.
 */
const parseGrid = (grid: string): Values | false => {
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
const parseGridValues = (grid: string): Values => {
  const chars = grid.replace(/[^0-9\.]/g, "");
  if (len(chars) !== 81) throw new Error(`Grid must be 81 characters, got ${len(chars)}: ${grid}`);
  return dict(squares, chars.split(""));
};

/**
 * Eliminate all the other values (except d) from values[s] and propagate.
 * Return values, except return false if a contradiction is detected.
 */
const assign = (values: Values, s: string, d: string): Values | false => {
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
const eliminate = (values: Values, s: string, d: string): Values | false => {
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
const display = (values: Values, toFile: boolean = false): string => {
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
const search = (values: Values | false): Values | false => {
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
const solved = (values: Values | false): boolean => {
  if (!values) return false;
  const unitSolved = (unit: string[]): boolean => {
    const udigits = map(unit, (s: string) => values[s]);
    udigits.sort();
    return udigits.join("") === digits;
  };
  return all(unitlist, unitSolved);
};

/**
 * Make a random puzzle with N or more assignments.
 */
const randomPuzzle = (N = 17): string => {
  const values: Values = {};
  each(squares, (s: string) => {
    values[s] = digits;
  });

  for (const s of shuffled(squares)) {
    const d = values[s][Math.floor(Math.random() * values[s].length)];
    if (!assign(values, s, d)) {
      break;
    }
    const ds = filter(
      map(squares, (s: string) => values[s]),
      (sd: string) => sd.length === 1,
    );
    if (len(ds) >= N && Array.from(set(ds)).length >= 8) {
      return map(squares, (s: string) => (values[s].length === 1 ? values[s] : ".")).join("");
    }
  }
  return randomPuzzle(N); // Give up and make a new puzzle
};

/**
 * Attempt to solve a sequence of grids. Report results.
 * When showif is a number of seconds, display puzzles that take longer.
 * When showif is None, don't display any puzzles.
 */
const solveAll = (grids: string[], name: string = "", showif: number | null = 0.0): void => {
  const timeSolve = (grid: string): [number, boolean] => {
    const start = performance.now();
    const values = solve(grid);
    const t = (performance.now() - start) / 1000; // Convert to seconds

    if (showif !== null && t > showif) {
      const output = [
        display(parseGridValues(grid), true),
        values ? display(values, true) : "No solution found",
        `(${t.toFixed(2)} seconds)\n`
      ].join("\n");

      append("log.txt", output);
      
      // Also show in console
      display(parseGridValues(grid));
      if (values) display(values);
      console.log(`(${t.toFixed(2)} seconds)\n`);
    }
    return [t, solved(values)];
  };

  const results = grids.map(timeSolve);
  const times = results.map(([t]) => t);
  const solvedCount = results.filter(([, s]) => s).length;
  const N = grids.length;

  if (N > 1) {
    const avgTime = times.reduce((a, b) => a + b, 0) / N;
    const maxTime = Math.max(...times);
    const Hz = N / times.reduce((a, b) => a + b, 0);
    const summary = `Solved ${solvedCount} of ${N} ${name} puzzles ` +
      `(avg ${avgTime.toFixed(2)} secs (${Hz.toFixed(0)} Hz), ` +
      `max ${maxTime.toFixed(2)} secs).\n\n`;
    
    console.log(summary.trim());
    append("log.txt", summary);
  }
};

// Main solver function
const solve = (grid: string): Values | false => search(parseGrid(grid));

// Run tests
const test = (): void => {
  assert(len(squares) === 81, "squares length");
  assert(len(unitlist) === 27, "unitlist length");
  assert(all(squares, (s: string) => len(units[s]) === 3), "units length");
  assert(all(squares, (s: string) => len(peers[s]) === 20), "peers length");
  
  const sunits = map(units["C2"], (u: string[]) => u.join(","));
  assert(
    contains(sunits, "A2,B2,C2,D2,E2,F2,G2,H2,I2") &&
    contains(sunits, "C1,C2,C3,C4,C5,C6,C7,C8,C9") &&
    contains(sunits, "A1,A2,A3,B1,B2,B3,C1,C2,C3"),
    "C2 units test"
  );
  
  assert(
    all(
      [
        "A2", "B2", "D2", "E2", "F2", "G2", "H2", "I2",
        "C1", "C3", "C4", "C5", "C6", "C7", "C8", "C9",
        "A1", "A3", "B1", "B3"
      ],
      (s: string) => contains(peers["C2"], s)
    ),
    "C2 peers test"
  );
  
  console.log("All tests pass!");
};

/**
 * Parse a puzzle file into a list of puzzles.
 */
const parsePuzzleFile = (filename: string): string[] => {
  return open(filename);
};

// Main function to run all tests and solve puzzles
const main = async (): Promise<void> => {
  test();
  
  // Create log file at the start
  create("log.txt", "Sudoku Solver Results\n===================\n");
  
  try {
    console.log("\n=== Solving Easy Puzzles ===");
    append("log.txt", "\n=== Solving Easy Puzzles ===\n");
    const easyPuzzles = parsePuzzleFile("puzzles/easy50.txt");
    if (easyPuzzles.length === 0) {
      console.log("No valid puzzles found in easy50.txt");
      append("log.txt", "No valid puzzles found in easy50.txt\n");
    } else {
      solveAll(easyPuzzles, "easy");
    }

    console.log("\n=== Solving Hard Puzzles ===");
    append("log.txt", "\n=== Solving Hard Puzzles ===\n");
    const hardPuzzles = parsePuzzleFile("puzzles/top95.txt");
    if (hardPuzzles.length === 0) {
      console.log("No valid puzzles found in top95.txt");
      append("log.txt", "No valid puzzles found in top95.txt\n");
    } else {
      solveAll(hardPuzzles, "hard");
    }

    console.log("\n=== Solving Hardest Puzzles ===");
    append("log.txt", "\n=== Solving Hardest Puzzles ===\n");
    const hardestPuzzles = parsePuzzleFile("puzzles/hardest.txt");
    if (hardestPuzzles.length === 0) {
      console.log("No valid puzzles found in hardest.txt");
      append("log.txt", "No valid puzzles found in hardest.txt\n");
    } else {
      solveAll(hardestPuzzles, "hardest");
    }

    console.log("\n=== Solving Random Puzzles ===");
    append("log.txt", "\n=== Solving Random Puzzles ===\n");
    solveAll(range(0, 99).map(() => randomPuzzle()), "random", 100.0);
  } catch (error: unknown) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      console.log("\n=== Note: Puzzle files not found, only running random puzzles ===");
      append("log.txt", "\n=== Note: Puzzle files not found, only running random puzzles ===\n");
      console.log("\n=== Solving Random Puzzles ===");
      append("log.txt", "\n=== Solving Random Puzzles ===\n");
      solveAll(range(0, 99).map(() => randomPuzzle()), "random", 100.0);
    } else {
      throw error;
    }
  }
};

main();