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

// Pre-computed SQUARES array for efficient conversion (same as fast implementations)
const COLS = ['A','B','C','D','E','F','G','H','I'];
const ROWS = ['1','2','3','4','5','6','7','8','9'];
const SQUARES = [];
for (let c = 0; c < COLS.length; c++) {
  for (let r = 0; r < ROWS.length; r++) {
    SQUARES.push(COLS[c] + ROWS[r]);
  }
}

// Difficulty targets (absolute clue counts)
const DIFFICULTY_TARGETS = {
  easy: 35,
  medium: 28,
  hard: 20
};



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

// Optimized conversion functions using pre-computed SQUARES array
function objectToGridString(puzzleObject) {
  // Use the same efficient approach as sudoku.lib.js serialize function
  let result = '';
  for (let i = 0; i < SQUARES.length; i++) {
    result += puzzleObject[SQUARES[i]] || '.';
  }
  return result;
}

function generateRandomPuzzle() {
  // Generate a puzzle and return it as a string
  const puzzle = generate("easy");
  // Use optimized conversion - no expensive coordinate calculations
  return objectToGridString(puzzle);
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
    // Use optimized conversion - no expensive coordinate calculations
    const solutionStr = objectToGridString(solution);
    console.log("\nSolution:");
    displayGrid(solutionStr);
    console.log(`Solved in ${solveTime}ms`);
  } else {
    console.log("Failed to solve puzzle");
  }

  // 2. Puzzle generation
  console.log("\n2. Puzzle Generation:");
  ["easy", "medium", "hard"].forEach((difficulty) => {
    console.log(`\n--- ${difficulty.toUpperCase()} DIFFICULTY ---`);
    
    const puzzle = generate(difficulty);
    const actualCount = Object.keys(puzzle).length;
    const targetCount = DIFFICULTY_TARGETS[difficulty];
    
    console.log(`Target: ${targetCount} clues`);
    console.log(`Actual: ${actualCount} clues`);

    // Show sample puzzle for each difficulty
    const gridStr = objectToGridString(puzzle);
    console.log(`Puzzle:`);
    displayGrid(gridStr);
    
    // Solve the puzzle and show solution
    const start = Date.now();
    const solution = solve(puzzle);
    const solveTime = Date.now() - start;
    
    if (solution) {
      const solutionStr = objectToGridString(solution);
      console.log(`Solution (solved in ${solveTime}ms):`);
      displayGrid(solutionStr);
    } else {
      console.log(`Failed to solve ${difficulty} puzzle`);
    }
    
    // Check uniqueness
    const unique = isUnique(puzzle);
    console.log(`Unique solution: ${unique}`);
  });

  // 3. Serialization
  console.log("\n3. Serialization:");
  const puzzle = generate("easy");
  const serialized = serialize(puzzle);
  const deserialized = deserialize(serialized);
  console.log(`Original clues: ${Object.keys(puzzle).length}`);
  console.log(`Serialized: ${serialized} (${serialized.length} chars)`);
  console.log(`Deserialized clues: ${Object.keys(deserialized).length}`);
  
  // Proper object comparison instead of fragile JSON.stringify comparison
  function objectsEqual(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) {
      return false;
    }
    
    for (const key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }
    
    return true;
  }
  
  const roundTripSuccess = objectsEqual(puzzle, deserialized);
  console.log(`Round-trip successful: ${roundTripSuccess}`);

  // 4. Uniqueness checking
  console.log("\n4. Uniqueness Checking:");
  const uniquePuzzle = generate("easy");
  const isUniquePuzzle = isUnique(uniquePuzzle);
  console.log(`Generated puzzle is unique: ${isUniquePuzzle}`);

  // 5. Hints and conflicts
  console.log("\n5. Hints and Conflicts:");
  const testPuzzle = generate("easy");

  // Start with a realistic partial solution (puzzle clues + some logical moves)
  console.log("Testing hint system with progressive gameplay...");
  
  // Get the complete solution first
  const completeSolution = solve(testPuzzle);
  if (!completeSolution) {
    console.log("Could not solve test puzzle for hint demonstration");
    return;
  }
  
  // Create a realistic partial solution: original clues + a few logical moves
  const partialSolution = { ...testPuzzle }; // Start with all given clues
  
  // Add 3-5 logical next moves from the solution
  const unfilledSquares = SQUARES.filter(s => !testPuzzle[s]);
  const movesToAdd = Math.min(5, unfilledSquares.length);
  
  for (let i = 0; i < movesToAdd; i++) {
    const square = unfilledSquares[i];
    partialSolution[square] = completeSolution[square];
  }
  
  console.log(`Puzzle clues: ${Object.keys(testPuzzle).length}`);
  console.log(`Player progress: ${Object.keys(partialSolution).length} squares filled`);
  console.log(`Remaining: ${81 - Object.keys(partialSolution).length} squares`);

  // Test hint system
  const hint = getHint(testPuzzle, partialSolution);
  console.log(`Hint type: ${hint.type}`);
  
  if (hint.type === "squarehint") {
    const correctValue = completeSolution[hint.square];
    console.log(`Hint: Square ${hint.square} should be ${correctValue}`);
  } else if (hint.type === "unithint") {
    console.log(`Hint: In ${hint.unitType}, digit ${hint.digit} can only go in one place`);
  } else if (hint.type === "error") {
    console.log(`Error detected at square ${hint.square}`);
  } else {
    console.log(`Complex situation - no simple hints available`);
  }

  // Test conflicts with an intentional error
  const conflictTestSolution = { ...partialSolution };
  const firstEmptySquare = SQUARES.find(s => !conflictTestSolution[s]);
  if (firstEmptySquare) {
    // Add a wrong value to create a conflict
    const correctValue = completeSolution[firstEmptySquare];
    const wrongValue = correctValue === "1" ? "2" : "1";
    conflictTestSolution[firstEmptySquare] = wrongValue;
    
    const conflicts = getConflicts(conflictTestSolution);
    console.log(`Conflicts with wrong move: ${conflicts.length}`);
    
    if (conflicts.length > 0) {
      console.log(`Conflict detected: ${wrongValue} at ${firstEmptySquare} conflicts with existing values`);
    }
  } else {
    const conflicts = getConflicts(partialSolution);
    console.log(`Conflicts found: ${conflicts.length}`);
  }
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
