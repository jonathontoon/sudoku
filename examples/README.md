# Sudoku Library Examples

This folder contains demonstration scripts that showcase the capabilities of the TypeScript Sudoku library.

## Files

### `demo.js` (Recommended)

A comprehensive JavaScript demo that demonstrates all library features:

- Solves puzzles from the `/puzzles` directory
- Generates and solves 99 random puzzles
- Shows performance statistics
- Demonstrates all API functions with visual grid display

### `demo.ts`

TypeScript version of the demo with full type safety.

### `simple-usage.js`

A quick reference showing basic library usage for common tasks.

## Usage

### Quick Start (JavaScript)

```bash
# Make sure the library is built first
pnpm run build

# Run the demo
node examples/demo.js
```

### TypeScript Version

```bash
# Build the library
pnpm run build

# Run with Node.js ESM support
node --loader=tsx examples/demo.ts
```

### Using pnpm scripts

```bash
# Add to package.json scripts section:
"demo": "node examples/demo.js"

# Then run:
pnpm run demo
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