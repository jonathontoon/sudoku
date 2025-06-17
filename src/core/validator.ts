import { Values, Units, Peers } from '../types/grid';
import { squares, unitlist } from './grid';
import { filter, set } from '../utils/array';

// Create units and peers mappings
export const units: Units = {};
squares.forEach((s: string) => {
  units[s] = filter(unitlist, (u: string[]) => u.includes(s));
});

export const peers: Peers = {};
squares.forEach((s: string) => {
  peers[s] = set(filter(units[s].flat(), (s2: string) => s2 !== s));
});

/**
 * A puzzle is solved if each unit is a permutation of the digits 1 to 9.
 */
export const solved = (values: Values | false): boolean => {
  if (!values) return false;
  const unitSolved = (unit: string[]): boolean => {
    const udigits = unit.map((s: string) => values[s]);
    udigits.sort();
    return udigits.join('') === '123456789';
  };
  return unitlist.every(unitSolved);
};
