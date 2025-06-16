/**
 * Split string into characters.
 */
export const chars = (str: string): string[] => {
  if (str === '') return ['']
  return str.split("")
}

/**
 * Cross product of elements in A and elements in B.
 */
export const cross = (A: string[], B: string[]): string[] => {
  const result: string[] = [];
  for (const a of A) {
    for (const b of B) {
      result.push(a + b);
    }
  }
  return result;
};

/**
 * Repeat a string n times.
 */
export const repeat = (str: string, n: number): string => str.repeat(n); 