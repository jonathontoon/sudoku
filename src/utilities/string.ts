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