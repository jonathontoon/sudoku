import { describe, it, expect } from 'vitest';
import { digits, rows, cols, squares, unitlist, parseGridValues, display } from '../grid';

describe('Grid Constants', () => {
  it('should have correct digits', () => {
    expect(digits).toBe('123456789');
  });

  it('should have correct rows', () => {
    expect(rows).toBe('ABCDEFGHI');
  });

  it('should have correct cols', () => {
    expect(cols).toBe('123456789');
  });
});

describe('Grid Squares', () => {
  it('should have 81 squares', () => {
    expect(squares).toHaveLength(81);
  });

  it('should have correct square format', () => {
    expect(squares[0]).toBe('A1');
    expect(squares[80]).toBe('I9');
    expect(squares).toContain('E5'); // middle square
  });
});

describe('Unit List', () => {
  it('should have 27 units', () => {
    expect(unitlist).toHaveLength(27);
  });

  it('should have 9 row units', () => {
    const rowUnit = unitlist.find((unit) => unit.every((square) => square.startsWith('A')));
    expect(rowUnit).toHaveLength(9);
  });

  it('should have 9 column units', () => {
    const colUnit = unitlist.find((unit) => unit.every((square) => square.endsWith('1')));
    expect(colUnit).toHaveLength(9);
  });

  it('should have 9 box units', () => {
    const boxUnit = unitlist.find((unit) =>
      unit.every(
        (square) => ['A', 'B', 'C'].includes(square[0]) && ['1', '2', '3'].includes(square[1])
      )
    );
    expect(boxUnit).toHaveLength(9);
  });
});

describe('parseGridValues', () => {
  it('should parse a valid grid string', () => {
    const grid = '1'.repeat(81);
    const values = parseGridValues(grid);
    expect(Object.keys(values)).toHaveLength(81);
    expect(values['A1']).toBe('1');
  });

  it('should handle grid with dots', () => {
    const grid = '.'.repeat(81);
    const values = parseGridValues(grid);
    expect(Object.keys(values)).toHaveLength(81);
    expect(values['A1']).toBe('.');
  });

  it('should pad short grid with dots', () => {
    const grid = '123456789';
    const values = parseGridValues(grid);
    expect(Object.keys(values)).toHaveLength(81);
    expect(values['A1']).toBe('1');
    expect(values['I9']).toBe('.');
  });

  it('should clean invalid characters from grid', () => {
    const grid = 'abc123def456ghi789'.repeat(5);
    const values = parseGridValues(grid);
    expect(Object.keys(values)).toHaveLength(81);
    expect(values['A1']).toBe('1');
  });
});

describe('display', () => {
  it('should display empty grid', () => {
    const values = parseGridValues('.'.repeat(81));
    const output = display(values, true);
    expect(output).toContain('.');
    expect(output).toContain('-+-+-');
  });

  it('should handle invalid grid state', () => {
    const output = display({} as any, true);
    expect(output).toContain('Empty grid state');
  });

  it('should handle null grid state', () => {
    const output = display(null as any, true);
    expect(output).toContain('Invalid grid state');
  });

  it('should display filled grid', () => {
    const values = parseGridValues('1'.repeat(81));
    const output = display(values, true);
    expect(output).toContain('1');
    expect(output).toContain('-+-+-');
    expect(output.split('\n').length).toBeGreaterThan(9); // header + 9 rows + footer
  });
});
