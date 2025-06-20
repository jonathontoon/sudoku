# Sudoku Solver

A high-performance TypeScript implementation of Peter Norvig's constraint propagation Sudoku solver algorithm, packaged as a modern JavaScript library.

[![Tests](https://img.shields.io/badge/tests-157%20passing-brightgreen)](#testing)
[![Coverage](https://img.shields.io/badge/coverage-86.23%25-green)](#testing)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](#)
[![License](https://img.shields.io/badge/license-MIT-blue)](#license)

## Features

- **🚀 Fast solving**: Constraint propagation with search backtracking
- **🎲 Puzzle generation**: Generate puzzles with configurable difficulty levels
- **🔍 Validation**: Check puzzle validity and find conflicts
- **💡 Hints**: Get solving hints and suggestions
- **📦 Serialization**: Compact puzzle encoding/decoding
- **🔧 Utilities**: Rich set of helper functions and utilities
- **📝 TypeScript**: Full type safety with comprehensive type definitions
- **🌐 Universal**: Works in browsers, Node.js, and bundlers
- **📚 Well-tested**: 157 tests with 86% coverage

## Installation

```bash
npm install sudoku-solver
# or
pnpm add sudoku-solver
# or
yarn add sudoku-solver
```

## Quick Start

### Solving a Puzzle

```javascript
import { solve } from 'sudoku-solver';

// Puzzle string: 0 = empty cell, 1-9 = filled cells
const puzzle = '003020600900305001001806400008102900700000008006708200002609500800203009005010300';
const solution = solve(puzzle);

console.log('Solution:', solution);
// Solution: 483921657967345821251876493548132976729564138136798245372689514814253769695417382
```

### Generating a New Puzzle

```javascript
import { generate } from 'sudoku-solver';

// Generate an easy puzzle (35 clues)
const puzzle = generate('easy');
console.log('Generated puzzle:', puzzle);

// Generate with custom difficulty
const hardPuzzle = generate('hard'); // 23-26 clues
```

### Getting Hints

```javascript
import { getHint, solve } from 'sudoku-solver';

const puzzle = '003020600900305001001806400008102900700000008006708200002609500800203009005010300';
const hint = getHint(puzzle);

console.log('Hint:', hint);
// Provides the next logical move or suggests a strategy
```

## API Reference

### Core Functions

#### `solve(puzzle: string): string | false`
Solves a sudoku puzzle using constraint propagation.
- **puzzle**: 81-character string with digits 1-9 and 0 for empty cells
- **Returns**: Solution string or `false` if unsolvable

#### `generate(difficulty?: Difficulty): string`
Generates a new sudoku puzzle.
- **difficulty**: `'easy'` (35 clues), `'medium'` (28-32 clues), `'hard'` (23-26 clues)
- **Returns**: Generated puzzle string

#### `isUnique(puzzle: string): boolean`
Checks if a puzzle has exactly one solution.
- **puzzle**: Puzzle string to validate
- **Returns**: `true` if puzzle has unique solution

### Validation Functions

#### `isSolved(puzzle: string): boolean`
Checks if a puzzle is completely solved.

#### `getConflicts(puzzle: string): Conflict[]`
Finds all conflicts in the current puzzle state.

#### `isSolvableWithElimination(puzzle: string): boolean`
Checks if puzzle can be solved using only elimination techniques.

### Utility Functions

#### `serialize(puzzle: string): string`
Compresses a puzzle into a shorter string format.

#### `deserialize(compressed: string): string`
Decompresses a serialized puzzle back to standard format.

#### `getHint(puzzle: string): Hint`
Provides solving hints and suggestions for the next move.

### Constants

```javascript
import { DIGITS, SQUARES, ROWS, COLS } from 'sudoku-solver';

console.log(DIGITS);  // '123456789'
console.log(SQUARES); // ['A1', 'A2', ..., 'I9']
console.log(ROWS);    // 'ABCDEFGHI'
console.log(COLS);    // '123456789'
```

## Examples

Check out the [`examples/`](./examples/) directory for complete usage examples:

- **[demo.js](./examples/demo.js)** - Comprehensive feature demonstration
- **[demo.ts](./examples/demo.ts)** - TypeScript version of the demo
- **[simple-usage.js](./examples/simple-usage.js)** - Basic usage examples
- **[simple-usage.ts](./examples/simple-usage.ts)** - TypeScript basic examples

Run examples:
```bash
npm run demo        # JavaScript comprehensive demo
npm run demo:ts     # TypeScript comprehensive demo
npm run simple      # JavaScript simple examples
npm run simple:ts   # TypeScript simple examples
```

## Development

### Prerequisites

- Node.js 18+ 
- pnpm (recommended package manager)

### Setup

```bash
git clone <repository-url>
cd sudoku
pnpm install
```

### Available Scripts

```bash
# Building
pnpm run build          # Full build (bundle + minified)
pnpm run build:bundle   # Main ES module bundle
pnpm run build:min      # Minified build only
pnpm run clean          # Clean dist directory
pnpm run watch          # Watch mode development

# Testing
pnpm run test           # Run all tests
pnpm run test:watch     # Watch mode testing
pnpm run test:coverage  # Run tests with coverage
pnpm run test:types     # TypeScript type checking

# Code Quality
pnpm run format         # Format code with Prettier
pnpm run format:check   # Check code formatting

# Examples
pnpm run demo           # Run comprehensive demo
pnpm run demo:ts        # Run TypeScript demo
pnpm run simple         # Run simple examples
pnpm run simple:ts      # Run TypeScript simple examples
```

### Project Structure

```
sudoku/
├── src/
│   ├── core/           # Core solving algorithms
│   ├── game/           # Game utilities (hints, validation)
│   ├── generator/      # Puzzle generation
│   ├── utils/          # Utility functions
│   └── types/          # TypeScript type definitions
├── examples/           # Usage examples
├── puzzles/            # Test puzzle collections
└── dist/              # Built library files
```

### Testing

The library has comprehensive test coverage with 157 tests across all modules:

- **Unit tests**: Test individual functions and modules
- **Integration tests**: Test complete workflows
- **Performance tests**: Validate solving speed on puzzle collections

```bash
pnpm run test           # 157 tests
pnpm run test:coverage  # 86.23% coverage
```

## Build Output

The library provides multiple build formats:

- **`dist/sudoku.js`** (22.7KB) - Development build with readable code
- **`dist/sudoku.min.js`** (12.0KB) - Minified production build  
- **`dist/index.d.ts`** (2.1KB) - TypeScript definitions

Compatible with:
- ✅ **ES Modules** (import/export)
- ✅ **Node.js** (CommonJS via module resolution)
- ✅ **Browsers** (modern ES2020+)
- ✅ **Bundlers** (Webpack, Rollup, Parcel, Vite)
- ✅ **TypeScript** (full type safety)

## Algorithm & Performance

This implementation is based on **Peter Norvig's constraint propagation algorithm** with the following optimizations:

1. **Constraint Propagation**: Eliminates impossible values using sudoku rules
2. **Naked Singles**: Fills cells with only one possible value
3. **Hidden Singles**: Finds values that can only go in one place
4. **Search with Backtracking**: Tries values systematically when needed

### Performance Benchmarks

Tested on collections of real-world puzzles:

- **Easy puzzles** (50): ~0.7ms average, 1,470 puzzles/second
- **Hard puzzles** (95): ~2.6ms average, 380 puzzles/second  
- **Hardest puzzles** (11): ~1.1ms average, 916 puzzles/second

## Lineage & History

This library has evolved through several iterations:

### **Origins** 
- **Algorithm**: Based on Peter Norvig's seminal essay ["Solving Every Sudoku Puzzle"](http://norvig.com/sudoku.html)
- **Language**: Originally implemented in Python, translated to TypeScript
- **Philosophy**: Emphasizes constraint propagation over brute force search

### **Development Journey**
1. **Initial Implementation** (2024): Core solver in TypeScript
2. **Feature Expansion**: Added puzzle generation, hints, validation
3. **Build Migration**: Migrated from Vite to ParcelJS for better library distribution
4. **Test Migration**: Moved from Vitest to Jest for framework-agnostic testing
5. **Production Ready**: Comprehensive test suite, examples, and documentation

### **Technical Evolution**
- **Build System**: Vite → **ParcelJS** (better for libraries)
- **Testing**: Vitest → **Jest** (framework agnostic)
- **Module System**: Full ESM support with backward compatibility
- **Distribution**: Multiple formats (dev/minified) with TypeScript definitions

### **Design Principles**
- **Performance**: Fast constraint propagation algorithm
- **Correctness**: Comprehensive test coverage (157 tests)
- **Usability**: Simple API with TypeScript support
- **Compatibility**: Works everywhere JavaScript runs

## Contributing

Contributions are welcome! Please read our contributing guidelines and ensure:

1. **Tests pass**: `pnpm run test`
2. **Code is formatted**: `pnpm run format`
3. **TypeScript compiles**: `pnpm run test:types`
4. **Examples work**: `pnpm run demo`

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Peter Norvig** - Original algorithm design and implementation
- **Sudoku community** - Test puzzles and validation datasets
- **Open source ecosystem** - Tools and libraries that made this possible

---

**Happy Sudoku Solving!** 🧩