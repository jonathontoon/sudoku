# Sudoku Library Examples

This folder contains demonstration scripts that showcase the capabilities of the TypeScript Sudoku library.

## Files

### `demo.cjs` (Recommended)

A comprehensive JavaScript demo that demonstrates all library features:

- Solves puzzles from the `/puzzles` directory
- Generates and solves 99 random puzzles
- Shows performance statistics
- Demonstrates all API functions with visual grid display

### `demo.ts`

TypeScript version of the demo with full type safety.

### `simple-usage.cjs`

A quick reference showing basic library usage for common tasks.

## Usage

### Quick Start (JavaScript)

```bash
# Make sure the library is built first
npm run build

# Run the demo
node examples/demo.cjs
```

### TypeScript Version

```bash
# Build the library
npm run build

# Run with Node.js ESM support
node --loader=tsx examples/demo.ts
```

### Using npm scripts

```bash
# Add to package.json scripts section:
"demo": "node examples/demo.cjs"

# Then run:
npm run demo
```

## What the Demo Does

### 1. Feature Demonstration

- **Basic Solving**: Solves a sample puzzle with visual before/after grids
- **Puzzle Generation**: Creates puzzles of different difficulties (easy/medium/hard)
- **Serialization**: Shows compression and decompression of puzzles
- **Uniqueness Checking**: Verifies puzzles have unique solutions
- **Hints & Conflicts**: Demonstrates game assistance features

### 2. Puzzle Collection Solving

- **Easy Puzzles**: 50 easy puzzles from `easy50.txt`
- **Hard Puzzles**: 95 challenging puzzles from `top95.txt`
- **Hardest Puzzles**: 11 extremely difficult puzzles from `hardest.txt`

### 3. Random Puzzle Generation

- Generates 99 random puzzles using the library
- Solves them all and reports performance statistics

## Sample Output

```
🧩 Sudoku Library Demo
======================

=== Feature Demonstration ===

1. Basic Puzzle Solving:
Puzzle:
┌───────┬───────┬───────┐
│     3 │   2   │ 6     │
│ 9     │ 3   5 │     1 │
│     1 │ 8   6 │ 4     │
├───────┼───────┼───────┤
│     8 │ 1   2 │ 9     │
│ 7     │       │     8 │
│     6 │ 7   8 │ 2     │
├───────┼───────┼───────┤
│     2 │ 6   9 │ 5     │
│ 8     │ 2   3 │     9 │
│     5 │   1   │ 3     │
└───────┴───────┴───────┘

Solution:
┌───────┬───────┬───────┐
│ 4 8 3 │ 9 2 1 │ 6 5 7 │
│ 9 6 7 │ 3 4 5 │ 8 2 1 │
│ 2 5 1 │ 8 7 6 │ 4 9 3 │
├───────┼───────┼───────┤
│ 5 4 8 │ 1 3 2 │ 9 7 6 │
│ 7 2 9 │ 5 6 4 │ 1 3 8 │
│ 1 3 6 │ 7 9 8 │ 2 4 5 │
├───────┼───────┼───────┤
│ 3 7 2 │ 6 8 9 │ 5 1 4 │
│ 8 1 4 │ 2 5 3 │ 7 6 9 │
│ 6 9 5 │ 4 1 7 │ 3 8 2 │
└───────┴───────┴───────┘
Solved in 2ms

=== Solving easy puzzles ===
Results for easy:
  Solved: 50/50 (100.0%)
  Average time: 1.2ms
  Max time: 4ms
  Rate: 833.3 puzzles/second
```

## Performance Expectations

The library is highly optimized and should achieve:

- **Easy puzzles**: ~1000+ puzzles/second
- **Hard puzzles**: ~100-500 puzzles/second
- **Hardest puzzles**: ~10-100 puzzles/second

Actual performance depends on your hardware and the specific puzzle difficulty.

## Puzzle File Formats

The demo reads puzzle files from the `/puzzles` directory:

- **easy50.txt**: 50 easy puzzles separated by "========"
- **top95.txt**: 95 hard puzzles, one per line
- **hardest.txt**: 11 extremely difficult puzzles, one per line

All puzzles use 81-character strings where digits 1-9 represent clues and '.' or '0' represent empty squares.
