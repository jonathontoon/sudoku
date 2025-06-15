/**
 * Sudoku Solver - Main Entry Point
 * -------------------------------
 * A TypeScript implementation of Peter Norvig's Sudoku solver algorithm.
 * This file serves as the main entry point and handles:
 * 1. Running validation tests
 * 2. Processing puzzle files
 * 3. Solving puzzles and measuring performance
 * 4. Logging results to both console and file
 *
 * The solver can handle puzzles of varying difficulty:
 * - Easy puzzles (from easy50.txt)
 * - Hard puzzles (from top95.txt)
 * - Hardest puzzles (from hardest.txt)
 * - Randomly generated puzzles
 *
 * @see http://norvig.com/sudoku.html for the original algorithm explanation
 */

import { openFile, createFile, appendFile, range, assert, len, all, contains, map } from "@utilities";

import { solve, display, parseGridValues, solved, randomPuzzle, squares, unitlist, units, peers } from "@sudoku";

/**
 * Run validation tests to ensure the solver's core data structures are correct.
 * Tests verify:
 * - Grid dimensions and structure
 * - Unit list completeness
 * - Unit and peer relationships for each square
 * - Specific test case for square C2's relationships
 */
const runTests = (): void => {
  assert(len(squares) === 81, "squares length");
  assert(len(unitlist) === 27, "unitlist length");
  assert(
    all(squares, (s: string) => len(units[s]) === 3),
    "units length",
  );
  assert(
    all(squares, (s: string) => len(peers[s]) === 20),
    "peers length",
  );

  const sunits = map(units["C2"], (u: string[]) => u.join(","));
  assert(
    contains(sunits, "A2,B2,C2,D2,E2,F2,G2,H2,I2") &&
      contains(sunits, "C1,C2,C3,C4,C5,C6,C7,C8,C9") &&
      contains(sunits, "A1,A2,A3,B1,B2,B3,C1,C2,C3"),
    "C2 units test",
  );

  assert(
    all(
      [
        "A2",
        "B2",
        "D2",
        "E2",
        "F2",
        "G2",
        "H2",
        "I2",
        "C1",
        "C3",
        "C4",
        "C5",
        "C6",
        "C7",
        "C8",
        "C9",
        "A1",
        "A3",
        "B1",
        "B3",
      ],
      (s: string) => contains(peers["C2"], s),
    ),
    "C2 peers test",
  );

  console.log("All tests pass!");
};

/**
 * Solve a sequence of Sudoku grids and report performance metrics.
 *
 * @param grids - Array of Sudoku puzzle strings to solve
 * @param name - Identifier for this batch of puzzles (e.g., "easy", "hard")
 * @param showif - Time threshold in seconds. Puzzles taking longer than this will be displayed.
 *                Set to null to never display puzzles.
 *
 * For each puzzle that takes longer than showif seconds, outputs:
 * 1. The original puzzle
 * 2. The solution (or "No solution found")
 * 3. The time taken
 *
 * For the entire batch, reports:
 * - Number of puzzles solved
 * - Average solving time
 * - Maximum solving time
 * - Solving rate (puzzles per second)
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
        `(${t.toFixed(2)} seconds)\n`,
      ].join("\n");

      appendFile("log.txt", output);

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
    const summary =
      `Solved ${solvedCount} of ${N} ${name} puzzles ` +
      `(avg ${avgTime.toFixed(2)} secs (${Hz.toFixed(0)} Hz), ` +
      `max ${maxTime.toFixed(2)} secs).\n\n`;

    console.log(summary.trim());
    appendFile("log.txt", summary);
  }
};

/**
 * Read and parse a puzzle file into an array of puzzle strings.
 * Expected format: One puzzle per line, using '.' or '0' for empty cells.
 *
 * @param filename - Path to the puzzle file
 * @returns Array of puzzle strings
 */
const parsePuzzleFile = (filename: string): string[] => {
  return openFile(filename);
};

/**
 * Main execution function that orchestrates the solving process:
 * 1. Runs validation tests
 * 2. Creates a log file for results
 * 3. Processes and solves puzzles in this order:
 *    - Easy puzzles (easy50.txt)
 *    - Hard puzzles (top95.txt)
 *    - Hardest puzzles (hardest.txt)
 *    - 100 randomly generated puzzles
 * 4. Handles missing puzzle files gracefully
 *
 * Results are written to both console and log.txt
 */
const main = async (): Promise<void> => {
  runTests();

  // Create log file at the start
  createFile("log.txt", "Sudoku Solver Results\n===================\n");

  try {
    console.log("\n=== Solving Easy Puzzles ===");
    appendFile("log.txt", "\n=== Solving Easy Puzzles ===\n");
    const easyPuzzles = parsePuzzleFile("puzzles/easy50.txt");
    if (easyPuzzles.length === 0) {
      console.log("No valid puzzles found in easy50.txt");
      appendFile("log.txt", "No valid puzzles found in easy50.txt\n");
    } else {
      solveAll(easyPuzzles, "easy");
    }

    console.log("\n=== Solving Hard Puzzles ===");
    appendFile("log.txt", "\n=== Solving Hard Puzzles ===\n");
    const hardPuzzles = parsePuzzleFile("puzzles/top95.txt");
    if (hardPuzzles.length === 0) {
      console.log("No valid puzzles found in top95.txt");
      appendFile("log.txt", "No valid puzzles found in top95.txt\n");
    } else {
      solveAll(hardPuzzles, "hard");
    }

    console.log("\n=== Solving Hardest Puzzles ===");
    appendFile("log.txt", "\n=== Solving Hardest Puzzles ===\n");
    const hardestPuzzles = parsePuzzleFile("puzzles/hardest.txt");
    if (hardestPuzzles.length === 0) {
      console.log("No valid puzzles found in hardest.txt");
      appendFile("log.txt", "No valid puzzles found in hardest.txt\n");
    } else {
      solveAll(hardestPuzzles, "hardest");
    }

    console.log("\n=== Solving Random Puzzles ===");
    appendFile("log.txt", "\n=== Solving Random Puzzles ===\n");
    solveAll(
      range(0, 99).map(() => randomPuzzle()),
      "random",
      100.0,
    );
  } catch (error: unknown) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      console.log("\n=== Note: Puzzle files not found, only running random puzzles ===");
      appendFile("log.txt", "\n=== Note: Puzzle files not found, only running random puzzles ===\n");
      console.log("\n=== Solving Random Puzzles ===");
      appendFile("log.txt", "\n=== Solving Random Puzzles ===\n");
      solveAll(
        range(0, 99).map(() => randomPuzzle()),
        "random",
        100.0,
      );
    } else {
      throw error;
    }
  }
};

// Start execution
main();
