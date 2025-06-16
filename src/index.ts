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

import { openFile, createFile, appendFile } from './utils/file';
import { range } from './utils/array';
import { assert } from './utils/test';
import { solve, randomPuzzle } from './core/solver';
import { solved } from './core/validator';
import { squares, unitlist, display } from './core/grid';
import { units, peers } from './core/validator';

/**
 * Run validation tests to ensure the solver's core data structures are correct.
 * Tests verify:
 * - Grid dimensions and structure
 * - Unit list completeness
 * - Unit and peer relationships for each square
 * - Specific test case for square C2's relationships
 */
const runTests = (): void => {
  assert(squares.length === 81, "squares length");
  assert(unitlist.length === 27, "unitlist length");
  assert(
    squares.every((s: string) => units[s].length === 3),
    "units length",
  );
  assert(
    squares.every((s: string) => peers[s].length === 20),
    "peers length",
  );

  const sunits = units["C2"].map((u: string[]) => u.join(","));
  assert(
    sunits.includes("A2,B2,C2,D2,E2,F2,G2,H2,I2") &&
      sunits.includes("C1,C2,C3,C4,C5,C6,C7,C8,C9") &&
      sunits.includes("A1,A2,A3,B1,B2,B3,C1,C2,C3"),
    "C2 units test",
  );

  assert(
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
    ].every((s: string) => peers["C2"].includes(s)),
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
const solveAll = (grids: string[], name: string = ""): void => {
  // Warmup runs
  for (let i = 0; i < 3; i++) {
    solve(grids[0]);
  }

  const timeSolve = (grid: string): [number, boolean] => {
    const start = performance.now();
    const values = solve(grid);
    const t = performance.now() - start; // Keep in milliseconds
    return [t, solved(values)];
  };

  const results = grids.map(timeSolve);
  const times = results.map(([t]) => t);
  const solvedCount = results.filter(([, s]) => s).length;
  const N = grids.length;

  if (N > 1) {
    const avgTime = times.reduce((a, b) => a + b, 0) / N / 1000; // Convert to seconds for display
    const maxTime = Math.max(...times) / 1000;
    const Hz = (N * 1000) / times.reduce((a, b) => a + b, 0);
    const summary =
      `Solved ${solvedCount} of ${N} ${name} puzzles ` +
      `(avg ${avgTime.toFixed(4)} secs (${Hz.toFixed(1)} Hz), ` +
      `max ${maxTime.toFixed(4)} secs).\n\n`;

    console.log(summary.trim());
    appendFile("log.txt", summary);
  }
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
    const easyPuzzles = openFile("puzzles/easy50.txt");
    if (easyPuzzles.length === 0) {
      console.log("No valid puzzles found in easy50.txt");
      appendFile("log.txt", "No valid puzzles found in easy50.txt\n");
    } else {
      solveAll(easyPuzzles, "easy");
    }

    console.log("\n=== Solving Hard Puzzles ===");
    appendFile("log.txt", "\n=== Solving Hard Puzzles ===\n");
    const hardPuzzles = openFile("puzzles/top95.txt");
    if (hardPuzzles.length === 0) {
      console.log("No valid puzzles found in top95.txt");
      appendFile("log.txt", "No valid puzzles found in top95.txt\n");
    } else {
      solveAll(hardPuzzles, "hard");
    }

    console.log("\n=== Solving Harder Puzzles ===");
    appendFile("log.txt", "\n=== Solving Harder Puzzles ===\n");
    const harderPuzzles = openFile("puzzles/harder.txt");
    if (harderPuzzles.length === 0) {
      console.log("No valid puzzles found in harder.txt");
      appendFile("log.txt", "No valid puzzles found in harder.txt\n");
    } else {
      solveAll(harderPuzzles, "harder");
    }

    console.log("\n=== Solving Hardest Puzzles ===");
    appendFile("log.txt", "\n=== Solving Hardest Puzzles ===\n");
    const hardestPuzzles = openFile("puzzles/hardest.txt");
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
      "random"
    );
  } catch (error: unknown) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      console.log("\n=== Note: Puzzle files not found, only running random puzzles ===");
      appendFile("log.txt", "\n=== Note: Puzzle files not found, only running random puzzles ===\n");
      console.log("\n=== Solving Random Puzzles ===");
      appendFile("log.txt", "\n=== Solving Random Puzzles ===\n");
      solveAll(
        range(0, 99).map(() => randomPuzzle()),
        "random"
      );
    } else {
      throw error;
    }
  }
};

// Start execution
main();
