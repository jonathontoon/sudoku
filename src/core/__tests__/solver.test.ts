import { describe, it, expect } from 'vitest';
import { parseGrid, assign, eliminate, solve, randomPuzzle } from '../solver';
import { solved } from '../validator';
import { parseGridValues } from '../grid';

describe('parseGrid', () => {
  it('should parse empty grid', () => {
    const values = parseGrid('.'.repeat(81));
    expect(values).toBeTruthy();
    if (values) {
      expect(Object.keys(values)).toHaveLength(81);
      expect(values['A1']).toBe('123456789');
    }
  });

  it('should parse valid grid', () => {
    // A valid grid with one number in each row
    const grid =
      '1........2........3........4........5........6........7........8........9........';
    const values = parseGrid(grid);
    expect(values).toBeTruthy();
    if (values) {
      expect(values['A1']).toBe('1');
      expect(values['B1']).not.toContain('1'); // eliminated from peers
    }
  });

  it('should return false for invalid grid', () => {
    // Invalid grid with same number in same row
    const grid = '11' + '.'.repeat(79);
    const values = parseGrid(grid);
    expect(values).toBe(false);
  });
});

describe('assign', () => {
  it('should assign value and propagate constraints', () => {
    const values = parseGrid('.'.repeat(81));
    if (!values) {
      throw new Error('Grid parsing failed');
    }

    const result = assign(values, 'A1', '1');
    expect(result).toBeTruthy();
    if (result) {
      expect(result['A1']).toBe('1');
      expect(result['A2']).not.toContain('1'); // peer elimination
    }
  });

  it('should return false for invalid assignment', () => {
    const grid = '1........' + '.'.repeat(72);
    const values = parseGrid(grid);
    if (!values) {
      throw new Error('Grid parsing failed');
    }

    // Try to assign 1 to a peer of A1 which already contains 1
    const result = assign(values, 'A2', '1');
    expect(result).toBe(false);
  });
});

describe('eliminate', () => {
  it('should eliminate value and propagate constraints', () => {
    const values = parseGrid('.'.repeat(81));
    if (!values) {
      throw new Error('Grid parsing failed');
    }

    const result = eliminate(values, 'A1', '1');
    expect(result).toBeTruthy();
    if (result) {
      expect(result['A1']).not.toContain('1');
    }
  });

  it('should return false when eliminating last value', () => {
    const values = parseGrid('.'.repeat(81));
    if (!values) {
      throw new Error('Grid parsing failed');
    }

    // First assign a single value
    const assigned = assign(values, 'A1', '1');
    if (!assigned) {
      throw new Error('Assignment failed');
    }

    // Try to eliminate the only value
    const result = eliminate(assigned, 'A1', '1');
    expect(result).toBe(false);
  });
});

describe('solve', () => {
  it('should solve easy puzzle', () => {
    const grid =
      '003020600' +
      '900305001' +
      '001806400' +
      '008102900' +
      '700000008' +
      '006708200' +
      '002609500' +
      '800203009' +
      '005010300';

    const solution = solve(grid);
    expect(solution).toBeTruthy();
    expect(solved(solution)).toBe(true);
  });

  it('should solve empty grid', () => {
    const solution = solve('.'.repeat(81));
    expect(solution).toBeTruthy();
    expect(solved(solution)).toBe(true);
  });

  it('should return false for unsolvable puzzle', () => {
    // Invalid grid with same number in same row
    const grid = '11' + '.'.repeat(79);
    const solution = solve(grid);
    expect(solution).toBe(false);
  });
});

describe('randomPuzzle', () => {
  it('should generate solvable puzzle with correct number of givens', () => {
    const givens = 30;
    const puzzle = randomPuzzle(givens);

    // Count non-empty cells
    const filledCells = puzzle.split('').filter((c) => c !== '.').length;
    expect(filledCells).toBe(givens);

    // Verify puzzle is solvable
    const solution = solve(puzzle);
    expect(solution).toBeTruthy();
    expect(solved(solution)).toBe(true);
  });

  it('should generate puzzle with reasonable number of givens', () => {
    const puzzle = randomPuzzle();

    // Count non-empty cells (should be between 17 and 30)
    const filledCells = puzzle.split('').filter((c) => c !== '.').length;
    expect(filledCells).toBeGreaterThanOrEqual(17);
    expect(filledCells).toBeLessThanOrEqual(30);

    // Verify puzzle is solvable
    const solution = solve(puzzle);
    expect(solution).toBeTruthy();
    expect(solved(solution)).toBe(true);
  });
});
