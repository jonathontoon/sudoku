import { each } from './array';

/**
 * Object utility functions
 */

/**
 * Extract all values from an object
 */
export function vals<T>(obj: Record<string, T>): T[] {
	const result: T[] = [];
	for (const key in obj) {
		result.push(obj[key]);
	}
	return result;
}

/**
 * Extract all keys from an object
 */
export function keys<T>(obj: Record<string, T>): string[] {
	const result: string[] = [];
	for (const key in obj) {
		result.push(key);
	}
	return result;
}

/**
 * Create a dictionary/object from arrays of keys and values
 */
export function dict<T>(keys: string[], values: T[]): Record<string, T> {
	const result: Record<string, T> = {};
	each(keys, (i, key) => {
		result[key] = values[i];
	});
	return result;
}

/**
 * Create a copy of an object
 */
export function copy<T>(obj: Record<string, T>): Record<string, T> {
	return dict(keys(obj), vals(obj));
} 