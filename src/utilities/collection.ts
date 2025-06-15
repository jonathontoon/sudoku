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