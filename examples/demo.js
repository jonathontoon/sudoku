#!/usr/bin/env node

/**
 * Sudoku Library Demo (JavaScript version)
 *
 * This script demonstrates the capabilities of the Sudoku library
 * by solving puzzles from various difficulty levels and generating random puzzles.
 *
 * Usage: node examples/demo.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Import the library from the built bundle
import {
  solve,
  generate,
  getHint,
  getConflicts,
  isUnique,
  serialize,
  deserialize,
} from "../dist/sudoku.js";

// Get current directory and project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

// Utility functions
function fromFile(filename, separator = "\n") {
  const filepath = path.join(projectRoot, "puzzles", filename);
  const content = fs.readFileSync(filepath, "utf-8");
  return content
    .trim()
    .split(separator)
    .filter((line) => line.length > 0);
}

function timeSolve(grid) {
  const start = Date.now();
  const solution = solve(grid);
  const elapsed = Date.now() - start;
  const isSolved = solution !== false;
  return [elapsed, isSolved];
}

function solveAll(grids, name, showSlow = 0) {
  console.log(`\n=== Solving ${name} puzzles ===`);

  const times = [];
  const results = [];
  let slowCount = 0;

  grids.forEach((grid, index) => {
    const [time, solved] = timeSolve(grid);
    times.push(time);
    results.push(solved);

    // Show slow puzzles
    if (showSlow && time > showSlow) {
      console.log(`Slow puzzle #${index + 1} (${time}ms):`);
      console.log(grid);
      slowCount++;
    }

    // Progress indicator for large sets
    if (grids.length > 10 && (index + 1) % 10 === 0) {
      process.stdout.write(`Progress: ${index + 1}/${grids.length}\r`);
    }
  });

  const solved = results.filter((r) => r).length;
  const totalTime = times.reduce((a, b) => a + b, 0);
  const avgTime = totalTime / grids.length;
  const maxTime = Math.max(...times);
  const rate = grids.length / (totalTime / 1000);

  console.log(`\nResults for ${name}:`);
  console.log(
    `  Solved: ${solved}/${grids.length} (${((100 * solved) / grids.length).toFixed(1)}%)`
  );
  console.log(`  Average time: ${avgTime.toFixed(1)}ms`);
  console.log(`  Max time: ${maxTime}ms`);
  console.log(`  Rate: ${rate.toFixed(1)} puzzles/second`);
  if (slowCount > 0) {
    console.log(`  Slow puzzles (>${showSlow}ms): ${slowCount}`);
  }
}

function generateRandomPuzzle() {
  // Generate a puzzle and return it as a string
  const puzzle = generate("easy");
  const grid = Array(81).fill(".");

  // Convert puzzle object to grid string
  for (const [square, digit] of Object.entries(puzzle)) {
    const row = square.charCodeAt(0) - "A".charCodeAt(0);
    const col = parseInt(square[1]) - 1;
    const index = row * 9 + col;
    grid[index] = digit;
  }

  return grid.join("");
}

function displayGrid(gridString) {
  // Display a grid in a nice 9x9 format
  console.log("┌───────┬───────┬───────┐");
  for (let row = 0; row < 9; row++) {
    let line = "│ ";
    for (let col = 0; col < 9; col++) {
      const index = row * 9 + col;
      const char = gridString[index] === "." ? " " : gridString[index];
      line += char + " ";
      if (col === 2 || col === 5) line += "│ ";
    }
    line += "│";
    console.log(line);

    if (row === 2 || row === 5) {
      console.log("├───────┼───────┼───────┤");
    }
  }
  console.log("└───────┴───────┴───────┘");
}

function demonstrateFeatures() {
  console.log("\n=== Feature Demonstration ===");

  // 1. Basic solving
  console.log("\n1. Basic Puzzle Solving:");
  const easyPuzzle =
    "003020600900305001001806400008102900700000008006708200002609500800203009005010300";
  console.log("Puzzle:");
  displayGrid(easyPuzzle);

  const start = Date.now();
  const solution = solve(easyPuzzle);
  const solveTime = Date.now() - start;

  if (solution) {
    // Convert solution to string format
    const solutionStr = Array(81).fill("");
    for (const [square, digit] of Object.entries(solution)) {
      const row = square.charCodeAt(0) - "A".charCodeAt(0);
      const col = parseInt(square[1]) - 1;
      const index = row * 9 + col;
      solutionStr[index] = digit;
    }
    console.log("\nSolution:");
    displayGrid(solutionStr.join(""));
    console.log(`Solved in ${solveTime}ms`);
  } else {
    console.log("Failed to solve puzzle");
  }

  // 2. Puzzle generation
  console.log("\n2. Puzzle Generation:");
  ["easy", "medium", "hard"].forEach((difficulty) => {
    const puzzle = generate(difficulty);
    const count = Object.keys(puzzle).length;
    console.log(`${difficulty.toUpperCase()} puzzle: ${count} clues`);

    // Show the first generated puzzle
    if (difficulty === "easy") {
      const gridStr = generateRandomPuzzle();
      console.log("Sample easy puzzle:");
      displayGrid(gridStr);
    }
  });

  // 3. Serialization
  console.log("\n3. Serialization:");
  const puzzle = generate("easy");
  const serialized = serialize(puzzle);
  const deserialized = deserialize(serialized);
  console.log(`Original clues: ${Object.keys(puzzle).length}`);
  console.log(`Serialized: ${serialized} (${serialized.length} chars)`);
  console.log(`Deserialized clues: ${Object.keys(deserialized).length}`);
  console.log(`Round-trip successful: ${JSON.stringify(puzzle) === JSON.stringify(deserialized)}`);

  // 4. Uniqueness checking
  console.log("\n4. Uniqueness Checking:");
  const uniquePuzzle = generate("easy");
  const isUniquePuzzle = isUnique(uniquePuzzle);
  console.log(`Generated puzzle is unique: ${isUniquePuzzle}`);

  // 5. Hints and conflicts
  console.log("\n5. Hints and Conflicts:");
  const testPuzzle = generate("easy");

  // Create a partial solution with some moves
  const partialSolution = {};
  const puzzleKeys = Object.keys(testPuzzle);
  for (let i = 0; i < Math.min(5, puzzleKeys.length); i++) {
    partialSolution[puzzleKeys[i]] = testPuzzle[puzzleKeys[i]];
  }

  const hint = getHint(testPuzzle, partialSolution);
  const conflicts = getConflicts(partialSolution);

  console.log(`Hint type: ${hint.type}`);
  console.log(`Conflicts found: ${conflicts.length}`);
}

function main() {
  console.log("🧩 Sudoku Library Demo");
  console.log("======================");

  try {
    // Feature demonstration
    demonstrateFeatures();

    // Solve puzzle files
    console.log("\n=== Solving Puzzle Collections ===");

    // Easy puzzles
    const easyPuzzles = fromFile("easy50.txt", "========");
    solveAll(easyPuzzles, "easy", 100);

    // Hard puzzles
    const hardPuzzles = fromFile("top95.txt");
    solveAll(hardPuzzles, "hard", 500);

    // Hardest puzzles
    const hardestPuzzles = fromFile("hardest.txt");
    solveAll(hardestPuzzles, "hardest", 1000);

    // Generate and solve random puzzles
    console.log("\n=== Random Puzzle Generation ===");
    const randomPuzzles = [];
    console.log("Generating 99 random puzzles...");

    for (let i = 0; i < 99; i++) {
      randomPuzzles.push(generateRandomPuzzle());
      if ((i + 1) % 10 === 0) {
        process.stdout.write(`Generated: ${i + 1}/99\r`);
      }
    }
    console.log(""); // New line after progress

    solveAll(randomPuzzles, "random", 1000);

    console.log("\n✅ Demo completed successfully!");
  } catch (error) {
    console.error("❌ Demo failed:", error.message);
    process.exit(1);
  }
}

// Run the demo
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
