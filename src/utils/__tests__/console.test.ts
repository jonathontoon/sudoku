import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { print } from '../console';

describe('Console utilities', () => {
	let consoleSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
	});

	afterEach(() => {
		consoleSpy.mockRestore();
	});

	describe('print', () => {
		it('should call console.log with message and carriage return + newline', () => {
			print('test message');
			expect(consoleSpy).toHaveBeenCalledWith('test message\r\n');
		});

		it('should handle empty string', () => {
			print('');
			expect(consoleSpy).toHaveBeenCalledWith('\r\n');
		});

		it('should handle special characters', () => {
			const message = 'Hello\tWorld!';
			print(message);
			expect(consoleSpy).toHaveBeenCalledWith('Hello\tWorld!\r\n');
		});
	});
}); 