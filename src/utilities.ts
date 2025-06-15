import { writeFileSync, appendFileSync, readFileSync } from "fs";

// ============================================================================
// File Operations
// ============================================================================

/**
 * Create or overwrite a file with content.
 */
export const createFile = (filename: string, content: string): void => {
  writeFileSync(filename, content, "utf-8");
};

/**
 * Append content to an existing file.
 */
export const appendFile = (filename: string, content: string): void => {
  appendFileSync(filename, content, "utf-8");
};

/**
 * Read a file and split it into lines based on a delimiter.
 */
export const openFile = (filename: string, delimiter: string = "\n"): string[] => {
  try {
    const content = readFileSync(filename, "utf-8");
    return content
      .replace(/[^0-9\.]/g, "")  // Keep only digits and dots
      .match(/.{81}/g) || [];    // Split into chunks of 81 characters
  } catch (error) {
    console.error(`Error reading file ${filename}: ${error}`);
    return [];
  }
};

// ============================================================================
// Collection Operations
// ============================================================================

/**
 * Check if all elements in a list satisfy a predicate.
 */
export const all = <T>(list: T[], func: (value: T) => boolean): boolean => {
  for (const x of list) {
    if (!func(x)) return false;
  }
  return true;
};

/**
 * Check if a list contains a value.
 */
export const contains = <T>(list: T[], value: T): boolean => list.includes(value);

/**
 * Create a shallow copy of an object.
 */
export const copy = <T>(obj: T): T => ({ ...obj });

/**
 * Create an object from separate key and value arrays.
 */
export const dict = <T>(keys: string[], values: T[]): Record<string, T> => {
  const result: Record<string, T> = {};
  for (let i = 0; i < keys.length; i++) {
    result[keys[i]] = values[i];
  }
  return result;
};

/**
 * Iterate over array elements.
 */
export const each = <T>(list: T[], func: (value: T) => void): void => {
  for (const x of list) {
    func(x);
  }
};

/**
 * Get object keys.
 */
export const keys = <T>(obj: Record<string, T>): string[] => Object.keys(obj);

/**
 * Get array or string length.
 */
export const len = (obj: string | any[]): number => obj.length;

/**
 * Create a unique array from an array.
 */
export const set = <T>(list: T[]): T[] => Array.from(new Set(list));

/**
 * Check if any element in a list satisfies a predicate.
 */
export const some = <T, R>(list: T[], func: (value: T) => R | false): R | false => {
  for (const x of list) {
    const result = func(x);
    if (result !== false) return result;
  }
  return false;
};

/**
 * Get object values.
 */
export const vals = <T>(obj: Record<string, T>): T[] => Object.values(obj);

// ============================================================================
// Array Operations
// ============================================================================

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

// ============================================================================
// Math Operations
// ============================================================================

/**
 * Get maximum value in array.
 */
export const max = (list: number[]): number => Math.max(...list);

/**
 * Get minimum value in array.
 */
export const min = (list: number[]): number => Math.min(...list);

/**
 * Sum array of numbers.
 */
export const sum = (list: number[]): number => list.reduce((a, b) => a + b, 0);

// ============================================================================
// String Operations
// ============================================================================

/**
 * Center a string with padding.
 */
export const center = (text: string, width: number): string => {
  const padding = width - text.length;
  if (padding <= 0) return text;
  const leftPad = Math.floor(padding / 2);
  const rightPad = padding - leftPad;
  return " ".repeat(leftPad) + text + " ".repeat(rightPad);
};

/**
 * Split string into characters.
 */
export const chars = (str: string): string[] => str.split("");

/**
 * Repeat a string n times.
 */
export const repeat = (str: string, n: number): string => str.repeat(n);

// ============================================================================
// General Utilities
// ============================================================================

/**
 * Assert that a condition is true, throw an error if it's false.
 */
export const assert = (val: boolean, message?: string): void => {
  if (!val) {
    throw new Error(message || "Assert failed");
  }
}; 