import { cross, chars, contains, each, filter } from "../utils";

/**
 * Core Sudoku constants and data structures
 */

export const ROWS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;
export const COLS = ["A", "B", "C", "D", "E", "F", "G", "H", "I"] as const;
export const DIGITS = "123456789";

// Simple list of all squares, [A1, B1, C1, ..., I9] (row-major order)
export const SQUARES = cross([...ROWS], [...COLS]).map((square) => square[1] + square[0]);

// List of all units. Each unit contains 9 squares. [[A1,A2,...A9], [B1,B2,...,B9]...]
export const UNITLIST: string[][] = [];

// Build row units
each([...ROWS], (_, r) => {
  UNITLIST.push(cross([...COLS], [r]));
});

// Build column units
each([...COLS], (_, c) => {
  UNITLIST.push(cross([c], [...ROWS]));
});

// Build box units
each(["ABC", "DEF", "GHI"], (_, rs) => {
  each(["123", "456", "789"], (_, cs) => {
    UNITLIST.push(cross(chars(rs), chars(cs)));
  });
});

// Units organized by square. UNITS['A1'] = [['A1'...'A9'], ['A1'...'I1'], ['A1'...'C3']]
export const UNITS: Record<string, string[][]> = {};

// For each square, the list of other squares that share a unit with it
export const PEERS: Record<string, string[]> = {};

// Build UNITS and PEERS for each square
each(SQUARES, (_, s) => {
  UNITS[s] = filter(UNITLIST, (unit) => contains(unit, s));
});

each(SQUARES, (_, s) => {
  const allPeers: string[] = [];
  // Flatten all units for this square and collect unique peers
  each(UNITS[s], (_, unit) => {
    each(unit, (_, peer) => {
      if (peer !== s && !contains(allPeers, peer)) {
        allPeers.push(peer);
      }
    });
  });
  PEERS[s] = allPeers;
});
