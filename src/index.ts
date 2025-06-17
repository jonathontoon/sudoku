/**
 * Sudoku Solver - Main Entry Point
 * -------------------------------
 * A TypeScript implementation of Peter Norvig's Sudoku solver algorithm.
 * This file serves as the main entry point for the CLI tool and handles:
 * 1. Processing puzzle files
 * 2. Solving puzzles and measuring performance
 * 3. Logging results to both console and file
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
import { solve, randomPuzzle } from './core/solver';
import { solved } from './core/validator';

/**
 * Solve a sequence of Sudoku grids and report performance metrics.
 *
 * @param grids - Array of Sudoku puzzle strings to solve
 * @param name - Identifier for this batch of puzzles (e.g., "easy", "hard")
 *
 * For the entire batch, reports:
 * - Number of puzzles solved
 * - Average solving time
 * - Maximum solving time
 * - Solving rate (puzzles per second)
 */
const solveAll = (grids: string[], name: string = ''): void => {
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
    appendFile('log.txt', summary);
  }
};

/**
 * Main execution function that orchestrates the solving process:
 * 1. Creates a log file for results
 * 2. Processes and solves puzzles in this order:
 *    - Easy puzzles (easy50.txt)
 *    - Hard puzzles (top95.txt)
 *    - Hardest puzzles (hardest.txt)
 *    - 100 randomly generated puzzles
 * 3. Handles missing puzzle files gracefully
 *
 * Results are written to both console and log.txt
 */
const main = async (): Promise<void> => {
  // Create log file at the start
  createFile('log.txt', 'Sudoku Solver Results\n===================\n');

  try {
    console.log('\n=== Solving Easy Puzzles ===');
    appendFile('log.txt', '\n=== Solving Easy Puzzles ===\n');
    const easyPuzzles = openFile('puzzles/easy50.txt');
    if (easyPuzzles.length === 0) {
      console.log('No valid puzzles found in easy50.txt');
      appendFile('log.txt', 'No valid puzzles found in easy50.txt\n');
    } else {
      solveAll(easyPuzzles, 'easy');
    }

    console.log('\n=== Solving Hard Puzzles ===');
    appendFile('log.txt', '\n=== Solving Hard Puzzles ===\n');
    const hardPuzzles = openFile('puzzles/top95.txt');
    if (hardPuzzles.length === 0) {
      console.log('No valid puzzles found in top95.txt');
      appendFile('log.txt', 'No valid puzzles found in top95.txt\n');
    } else {
      solveAll(hardPuzzles, 'hard');
    }

    console.log('\n=== Solving Harder Puzzles ===');
    appendFile('log.txt', '\n=== Solving Harder Puzzles ===\n');
    const harderPuzzles = openFile('puzzles/harder.txt');
    if (harderPuzzles.length === 0) {
      console.log('No valid puzzles found in harder.txt');
      appendFile('log.txt', 'No valid puzzles found in harder.txt\n');
    } else {
      solveAll(harderPuzzles, 'harder');
    }

    console.log('\n=== Solving Hardest Puzzles ===');
    appendFile('log.txt', '\n=== Solving Hardest Puzzles ===\n');
    const hardestPuzzles = openFile('puzzles/hardest.txt');
    if (hardestPuzzles.length === 0) {
      console.log('No valid puzzles found in hardest.txt');
      appendFile('log.txt', 'No valid puzzles found in hardest.txt\n');
    } else {
      solveAll(hardestPuzzles, 'hardest');
    }

    console.log('\n=== Solving Random Puzzles ===');
    appendFile('log.txt', '\n=== Solving Random Puzzles ===\n');
    solveAll(
      range(0, 99).map(() => randomPuzzle()),
      'random'
    );
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      console.log('\n=== Note: Puzzle files not found, only running random puzzles ===');
      appendFile(
        'log.txt',
        '\n=== Note: Puzzle files not found, only running random puzzles ===\n'
      );
      console.log('\n=== Solving Random Puzzles ===');
      appendFile('log.txt', '\n=== Solving Random Puzzles ===\n');
      solveAll(
        range(0, 99).map(() => randomPuzzle()),
        'random'
      );
    } else {
      throw error;
    }
  }
};

// Start execution
main();
