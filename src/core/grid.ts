import { chars, cross, repeat } from '../utils/string';
import { Values } from '../types/grid';

// Grid Constants
export const digits = '123456789';
export const rows = 'ABCDEFGHI';
export const cols = digits;

// Calculate all squares and units
export const squares = cross(chars(rows), chars(cols));
export const unitlist = [
  ...chars(cols).map((c) => cross(chars(rows), [c])),
  ...chars(rows).map((r) => cross([r], chars(cols))),
  ...['ABC', 'DEF', 'GHI']
    .map((rs) => ['123', '456', '789'].map((cs) => cross(chars(rs), chars(cs))))
    .flat(),
];

/**
 * Convert grid into a dict of {square: char} with '0' or '.' for empties.
 */
export const parseGridValues = (grid: string): Values => {
  const cleanGrid = grid.replace(/[^0-9\.]/g, '').slice(0, 81);
  if (cleanGrid.length !== 81) {
    // If the grid is too short, pad with dots
    const paddedGrid = cleanGrid.padEnd(81, '.');
    return Object.fromEntries(squares.map((s, i) => [s, paddedGrid[i]]));
  }
  return Object.fromEntries(squares.map((s, i) => [s, cleanGrid[i]]));
};

/**
 * Display these values as a 2-D grid.
 */
export const display = (values: Values, toFile: boolean = false): string => {
  if (!values || typeof values !== 'object') {
    const msg = 'Invalid grid state';
    if (toFile) return msg + '\n';
    console.log(msg);
    return msg;
  }

  const lengths = Object.values(values).map((v: string) => v?.length || 0);
  if (lengths.length === 0) {
    const msg = 'Empty grid state';
    if (toFile) return msg + '\n';
    console.log(msg);
    return msg;
  }

  const width = 1 + Math.max(...lengths);
  const line = '-+-+-+-+-+-+-+-+-+-';
  const output: string[] = [];

  for (const r of rows) {
    const row = chars(cols)
      .map((c) => {
        const val = center(values[r + c] || '.', width);
        return c === '3' || c === '6' ? val + '|' : val;
      })
      .join('');
    output.push(row);
    if ('CF'.includes(r)) output.push(line);
  }
  output.push(''); // Add blank line at end

  const result = output.join('\n');
  if (!toFile) {
    console.log(result);
  }
  return result;
};

/**
 * Center a string with padding.
 */
const center = (text: string, width: number): string => {
  const padding = width - text.length;
  if (padding <= 0) return text;
  const leftPad = Math.floor(padding / 2);
  const rightPad = padding - leftPad;
  return repeat(' ', leftPad) + text + repeat(' ', rightPad);
};
