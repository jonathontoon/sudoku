import { each } from "./collection";

/**
 * Concatenate two arrays.
 */
export const concat = <T>(a: T[], b: T[]): T[] => [...a, ...b];

/**
 * Filter array elements based on a predicate function.
 */
export const filter = <T>(list: T[], func: (value: T) => boolean): T[] => {
  const result: T[] = [];
  each(list, function (val: T): void {
    if (func(val)) {
      result.push(val);
    }
  });
  return result;
};

/**
 * Get the first element of an array.
 */
export const first = <T>(arr: T[]): T | undefined => arr[0];

/**
 * Map array elements using a transform function.
 */
export const map = <T, U>(list: T[], func: (value: T) => U): U[] => {
  const result: U[] = [];
  each(list, function (val: T): void {
    result.push(func(val));
  });
  return result;
};

/**
 * Generate a range of numbers.
 */
export const range = (start: number, end: number): number[] => {
  const result: number[] = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

/**
 * Shuffle array elements randomly.
 */
export const shuffled = <T>(list: T[]): T[] => {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/**
 * Zip two arrays together.
 */
export const zip = <T, U>(a: T[], b: U[]): [T, U][] => {
  const result: [T, U][] = [];
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    result.push([a[i], b[i]]);
  }
  return result;
}; 