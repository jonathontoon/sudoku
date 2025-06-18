/**
 * Array utility functions
 */

/**
 * Iterate over a list and execute a function for each element
 */
export function each<T>(list: T[], func: (index: number, item: T) => void): void {
	for (let i = 0; i < list.length; i++) {
		func(i, list[i]);
	}
}

/**
 * Check if all elements in a list satisfy a condition
 */
export function all<T>(list: T[], func: (item: T) => boolean): boolean {
	for (let i = 0; i < list.length; i++) {
		if (!func(list[i])) {
			return false;
		}
	}
	return true;
}

/**
 * Check if any element in a list satisfies a condition
 */
export function any<T>(list: T[], func: (item: T) => boolean): boolean {
	for (let i = 0; i < list.length; i++) {
		const result = func(list[i]);
		if (result) {
			return result;
		}
	}
	return false;
}

/**
 * Filter a list based on a condition
 */
export function filter<T>(list: T[], func: ((index: number, item: T) => boolean) | ((item: T) => boolean)): T[] {
	const result: T[] = [];
	for (let i = 0; i < list.length; i++) {
		if (func.length > 1) {
			if ((func as (index: number, item: T) => boolean)(i, list[i])) {
				result.push(list[i]);
			}
		} else if ((func as (item: T) => boolean)(list[i])) {
			result.push(list[i]);
		}
	}
	return result;
}

/**
 * Return the first element in a sequence that satisfies a condition
 */
export function some<T>(seq: T[], func: (item: T) => any): any {
	for (let i = 0; i < seq.length; i++) {
		const result = func(seq[i]);
		if (result) {
			return result;
		}
	}
	return false;
}

/**
 * Transform each element in a list using a function or property accessor
 */
export function map<T, R>(list: T[], expr: ((item: T) => R) | string): R[] {
	const result: R[] = [];
	each(list, (_, value) => {
		if (typeof expr === 'function') {
			result.push(expr(value));
		} else if (typeof expr === 'string') {
			result.push((value as any)[expr]);
		}
	});
	return result;
}

/**
 * Get a random element from a list
 */
export function randomElement<T>(list: T[]): T {
	return list[Math.floor(Math.random() * list.length)];
}

/**
 * Check if a list contains a specific value
 */
export function contains<T>(list: T[], val: T): boolean {
	return any(list, (x) => x === val);
}

/**
 * Shuffle an array randomly (Fisher-Yates shuffle)
 */
export function shuffle<T>(seq: T[]): T[] {
	// Return a randomly shuffled copy of the input sequence
	const result = map(seq, (x) => x);
	// Fisher yates shuffle
	let i = result.length;
	while (--i) {
		const j = Math.floor(Math.random() * (i + 1));
		const ival = result[i];
		const jval = result[j];
		result[i] = jval;
		result[j] = ival;
	}
	
	return result;
}

/**
 * Convert a string to an array of characters
 */
export function chars(s: string): string[] {
	const result: string[] = [];
	for (let i = 0; i < s.length; i++) {
		result.push(s.charAt(i));
	}
	return result;
}

/**
 * Create a cross product of two arrays
 */
export function cross<T, U>(a: T[], b: U[]): string[] {
	const result: string[] = [];
	for (let i = 0; i < a.length; i++) {
		for (let j = 0; j < b.length; j++) {
			result.push(String(a[i]) + String(b[j]));
		}
	}
	return result;
} 