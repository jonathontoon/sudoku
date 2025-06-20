#!/usr/bin/env node

/**
 * Simple Sudoku Library Usage Example (TypeScript version)
 *
 * This shows the basic usage of the library for common tasks with TypeScript.
 */

import {
  solve,
  generate,
  getHint,
  getConflicts,
  isUnique,
  serialize,
  deserialize,
} from "../dist/sudoku.js";

console.log("🧩 Simple Sudoku Library Usage Examples (TypeScript)");
console.log("====================================================\n");

// Example 1: Solve a puzzle
console.log("1. Solving a puzzle:");
const puzzle: string =
  "003020600900305001001806400008102900700000008006708200002609500800203009005010300";
console.log("Input:", puzzle);

const solution = solve(puzzle);
if (solution) {
  // Convert to string for display
  const solutionStr: string[] = Array(81).fill("");
  for (const [square, digit] of Object.entries(solution)) {
    const row = square.charCodeAt(0) - "A".charCodeAt(0);
    const col = parseInt(square[1]) - 1;
    const index = row * 9 + col;
    solutionStr[index] = digit;
  }
  console.log("Output:", solutionStr.join(""));
} else {
  console.log("No solution found");
}

// Example 2: Generate a new puzzle
console.log("\n2. Generating a new puzzle:");
const newPuzzle = generate("easy");
console.log("Generated puzzle with", Object.keys(newPuzzle).length, "clues");
console.log("Sample squares:", Object.entries(newPuzzle).slice(0, 5));

// Example 3: Check if puzzle is unique
console.log("\n3. Checking uniqueness:");
const unique: boolean = isUnique(newPuzzle);
console.log("Puzzle has unique solution:", unique);

// Example 4: Serialize/deserialize
console.log("\n4. Serialization:");
const serialized: string = serialize(newPuzzle);
console.log("Serialized length:", serialized.length, "characters");
console.log(
  "Original size would be:",
  Object.keys(newPuzzle).length * 2,
  "characters (square+digit)"
);

const deserialized = deserialize(serialized);
console.log(
  "Deserialized correctly:",
  Object.keys(deserialized).length === Object.keys(newPuzzle).length
);

// Example 5: Get hints
console.log("\n5. Getting hints:");
const partialSolution: Record<string, string> = {};
// Take first 3 clues from the generated puzzle
const puzzleEntries = Object.entries(newPuzzle);
for (let i = 0; i < Math.min(3, puzzleEntries.length); i++) {
  partialSolution[puzzleEntries[i][0]] = puzzleEntries[i][1];
}

const hint = getHint(newPuzzle, partialSolution);
console.log("Hint type:", hint.type);
if (hint.square) {
  console.log("Suggested square:", hint.square);
}

// Example 6: Check for conflicts
console.log("\n6. Checking for conflicts:");
const conflicts = getConflicts(partialSolution);
console.log("Conflicts found:", conflicts.length);

console.log("\n✅ All examples completed!");
console.log("\nFor a comprehensive demo, run: npm run demo");
