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
 * Create a shallow copy of an object.
 */
export const copy = <T>(obj: T): T => ({ ...obj });

/**
 * Filter array elements based on a predicate function.
 */
export const filter = <T>(list: T[], func: (value: T) => boolean): T[] => {
  const result: T[] = [];
  list.forEach((val: T) => {
    if (func(val)) {
      result.push(val);
    }
  });
  return result;
};

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
