import { describe, it, expect } from 'vitest';
import { chars, cross, repeat } from '../string';

describe('string utils', () => {
  describe('chars', () => {
    it('should split string into characters', () => {
      expect(chars('hello')).toEqual(['h', 'e', 'l', 'l', 'o']);
    });

    it('should handle empty string', () => {
      expect(chars('')).toEqual(['']);
    });

    it('should handle special characters', () => {
      expect(chars('a b')).toEqual(['a', ' ', 'b']);
    });
  });

  describe('cross', () => {
    it('should return cross product of two arrays', () => {
      expect(cross(['A', 'B'], ['1', '2'])).toEqual(['A1', 'A2', 'B1', 'B2']);
    });

    it('should handle empty arrays', () => {
      expect(cross([], ['1', '2'])).toEqual([]);
      expect(cross(['A', 'B'], [])).toEqual([]);
      expect(cross([], [])).toEqual([]);
    });
  });

  describe('repeat', () => {
    it('should repeat string n times', () => {
      expect(repeat('a', 3)).toBe('aaa');
    });

    it('should return empty string when n is 0', () => {
      expect(repeat('a', 0)).toBe('');
    });

    it('should handle empty string', () => {
      expect(repeat('', 5)).toBe('');
    });
  });
});
