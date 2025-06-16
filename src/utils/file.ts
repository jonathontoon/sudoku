import { writeFileSync, appendFileSync, readFileSync } from 'fs';

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
    return (
      content
        .replace(/[^0-9\.]/g, "") // Keep only digits and dots
        .match(/.{81}/g) || []
    ); // Split into chunks of 81 characters
  } catch (error) {
    console.error(`Error reading file ${filename}: ${error}`);
    return [];
  }
}; 