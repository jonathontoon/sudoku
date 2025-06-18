# Sudoku Library Usage

This project can be used both as a CLI tool and as a library in other TypeScript/JavaScript projects.

## As a Library

### Installation

```bash
npm install sudoku-solver
```

### Basic Usage

```typescript
import sudoku, { solve, randomPuzzle, display } from 'sudoku-solver';

// Solve a puzzle
const puzzle = '4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......';
const solution = solve(puzzle);

if (solution) {
  console.log('Solved!');
  display(solution);
} else {
  console.log('No solution found');
}

// Generate a random puzzle
const randomPuzzleString = randomPuzzle(25); // 25 givens
console.log('Random puzzle:', randomPuzzleString);

// Using the default export
const anotherSolution = sudoku.solve(puzzle);
```

### Available Functions

#### Core Functions
- `solve(grid: string): Values | false` - Solve a Sudoku puzzle
- `randomPuzzle(N?: number): string` - Generate a random puzzle with N givens (default 17)
- `countSolutions(grid: string): number` - Count solutions (up to 2 for uniqueness checking)
- `solved(values: Values | false): boolean` - Check if a puzzle is solved
- `display(values: Values, toFile?: boolean): string` - Display puzzle in formatted grid
- `parseGridValues(grid: string): Values` - Parse grid string into internal format

#### Utility Functions
- `all<T>(list: T[], func: (value: T) => boolean): boolean`
- `copy<T>(obj: T): T`
- `filter<T>(list: T[], func: (value: T) => boolean): T[]`
- `set<T>(list: T[]): T[]`
- `some<T, R>(list: T[], func: (value: T) => R | false): R | false`
- `range(start: number, end: number): number[]`
- `shuffled<T>(list: T[]): T[]`
- `chars(str: string): string[]`
- `cross(A: string[], B: string[]): string[]`
- `repeat(str: string, n: number): string`

#### Constants
- `digits` - '123456789'
- `rows` - 'ABCDEFGHI'
- `cols` - '123456789'
- `squares` - All 81 square positions
- `unitlist` - All units (rows, columns, boxes)
- `units` - Units for each square
- `peers` - Peer squares for each square

#### Types
- `Values` - Record<string, string>
- `Units` - Record<string, string[][]>
- `Peers` - Record<string, string[]>
- `ConstraintResult` - [Values | false, boolean]

## As a CLI Tool

### Build and Run

```bash
npm run build
npm start
```

### Development

```bash
npm run dev
```

## Building

- `npm run build` - Build both CLI and library
- `npm run build:cli` - Build only CLI
- `npm run build:lib` - Build only library

## Testing

```bash
npm test
npm run test:watch
npm run test:coverage
```