import { describe, it, expect } from 'vitest';
import { units, peers, solved } from '../validator';
import { squares, parseGridValues } from '../grid';

describe('Units', () => {
  it('should have units for all squares', () => {
    expect(Object.keys(units)).toHaveLength(81);
  });

  it('should have 3 units per square', () => {
    squares.forEach((square) => {
      expect(units[square]).toHaveLength(3);
    });
  });

  it('should have correct units for middle square E5', () => {
    const e5Units = units['E5'];

    // Column unit (first)
    expect(e5Units[0]).toContain('A5');
    expect(e5Units[0]).toContain('I5');

    // Row unit (second)
    expect(e5Units[1]).toContain('E1');
    expect(e5Units[1]).toContain('E9');

    // Box unit (third)
    expect(e5Units[2]).toContain('D4');
    expect(e5Units[2]).toContain('F6');
  });
});

describe('Peers', () => {
  it('should have peers for all squares', () => {
    expect(Object.keys(peers)).toHaveLength(81);
  });

  it('should have 20 peers per square', () => {
    squares.forEach((square) => {
      expect(peers[square]).toHaveLength(20);
    });
  });

  it('should have correct peers for middle square E5', () => {
    const e5Peers = peers['E5'];

    // Row peers
    expect(e5Peers).toContain('E1');
    expect(e5Peers).toContain('E9');

    // Column peers
    expect(e5Peers).toContain('A5');
    expect(e5Peers).toContain('I5');

    // Box peers
    expect(e5Peers).toContain('D4');
    expect(e5Peers).toContain('F6');

    // Should not contain itself
    expect(e5Peers).not.toContain('E5');
  });
});

describe('Solved', () => {
  it('should return false for false input', () => {
    expect(solved(false)).toBe(false);
  });

  it('should return false for unsolved grid', () => {
    const values = parseGridValues('.'.repeat(81));
    expect(solved(values)).toBe(false);
  });

  it('should return false for partially solved grid', () => {
    const grid = '123456789'.repeat(4) + '.'.repeat(45);
    const values = parseGridValues(grid);
    expect(solved(values)).toBe(false);
  });

  it('should return true for solved grid', () => {
    // A valid solved Sudoku grid
    const grid =
      '123456789' +
      '456789123' +
      '789123456' +
      '234567891' +
      '567891234' +
      '891234567' +
      '345678912' +
      '678912345' +
      '912345678';
    const values = parseGridValues(grid);
    expect(solved(values)).toBe(true);
  });

  it('should return false for invalid solved grid', () => {
    // An invalid grid where all numbers are the same
    const grid = '1'.repeat(81);
    const values = parseGridValues(grid);
    expect(solved(values)).toBe(false);
  });
});
