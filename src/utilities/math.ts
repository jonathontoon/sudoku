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