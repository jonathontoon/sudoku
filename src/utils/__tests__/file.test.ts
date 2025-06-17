import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createFile, appendFile, openFile } from '../file';
import { unlinkSync, existsSync, readFileSync } from 'fs';
import path from 'path';

describe('file utils', () => {
  const testFilePath = path.join(__dirname, 'test.txt');

  beforeEach(() => {
    // Clean up any existing test file
    if (existsSync(testFilePath)) {
      unlinkSync(testFilePath);
    }
  });

  afterEach(() => {
    // Clean up after tests
    if (existsSync(testFilePath)) {
      unlinkSync(testFilePath);
    }
  });

  describe('createFile', () => {
    it('should create a new file with content', () => {
      createFile(testFilePath, 'test content');
      expect(existsSync(testFilePath)).toBe(true);
      const content = readFileSync(testFilePath, 'utf-8');
      expect(content).toBe('test content');
    });

    it('should overwrite existing file', () => {
      createFile(testFilePath, 'initial content');
      createFile(testFilePath, 'new content');
      const content = readFileSync(testFilePath, 'utf-8');
      expect(content).toBe('new content');
    });
  });

  describe('appendFile', () => {
    it('should append content to existing file', () => {
      createFile(testFilePath, '123456789');
      appendFile(testFilePath, '987654321');
      const content = readFileSync(testFilePath, 'utf-8');
      expect(content).toBe('123456789987654321');
    });
  });

  describe('openFile', () => {
    it('should read file and split into chunks of 81 characters', () => {
      const content = '1'.repeat(162); // Two chunks of 81 characters
      createFile(testFilePath, content);
      const result = openFile(testFilePath);
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveLength(81);
      expect(result[1]).toHaveLength(81);
    });

    it('should handle non-existent file', () => {
      const result = openFile('nonexistent.txt');
      expect(result).toEqual([]);
    });

    it('should filter out non-numeric characters except dots', () => {
      createFile(testFilePath, 'abc123.456def');
      const result = openFile(testFilePath);
      expect(result).toEqual([]); // Less than 81 chars after filtering

      // Test with exactly 81 numeric characters
      const numericContent = '1'.repeat(81);
      createFile(testFilePath, numericContent);
      const numericResult = openFile(testFilePath);
      expect(numericResult).toEqual([numericContent]);
    });
  });
});
