import { describe, it, expect } from 'vitest';
import { vals, keys, dict, copy } from '../object';

describe('Object utilities', () => {
	describe('vals', () => {
		it('should extract values from object', () => {
			const obj = { a: 1, b: 2, c: 3 };
			expect(vals(obj).sort()).toEqual([1, 2, 3]);
		});
	});

	describe('keys', () => {
		it('should extract keys from object', () => {
			const obj = { a: 1, b: 2, c: 3 };
			expect(keys(obj).sort()).toEqual(['a', 'b', 'c']);
		});
	});

	describe('dict', () => {
		it('should create object from keys and values', () => {
			const result = dict(['a', 'b', 'c'], [1, 2, 3]);
			expect(result).toEqual({ a: 1, b: 2, c: 3 });
		});
	});

	describe('copy', () => {
		it('should create a shallow copy of object', () => {
			const original = { a: 1, b: 2, c: 3 };
			const copied = copy(original);
			expect(copied).toEqual(original);
			expect(copied).not.toBe(original);
		});
	});
}); 