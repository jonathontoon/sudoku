import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debug, debugEnabled, setDebugEnabled } from '../debug';

describe('Debug utilities', () => {
	let consoleSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
		// Reset debug state before each test
		setDebugEnabled(false);
	});

	afterEach(() => {
		consoleSpy.mockRestore();
	});

	describe('debug', () => {
		it('should not log when debug is disabled', () => {
			setDebugEnabled(false);
			debug('test message');
			expect(consoleSpy).not.toHaveBeenCalled();
		});

		it('should log when debug is enabled', () => {
			setDebugEnabled(true);
			debug('test message');
			expect(consoleSpy).toHaveBeenCalledWith('test message\r\n');
		});

		it('should handle multiple debug calls', () => {
			setDebugEnabled(true);
			debug('message 1');
			debug('message 2');
			expect(consoleSpy).toHaveBeenCalledTimes(2);
			expect(consoleSpy).toHaveBeenNthCalledWith(1, 'message 1\r\n');
			expect(consoleSpy).toHaveBeenNthCalledWith(2, 'message 2\r\n');
		});
	});

	describe('setDebugEnabled', () => {
		it('should enable debug logging', () => {
			setDebugEnabled(true);
			debug('test');
			expect(consoleSpy).toHaveBeenCalled();
		});

		it('should disable debug logging', () => {
			setDebugEnabled(true);
			setDebugEnabled(false);
			debug('test');
			expect(consoleSpy).not.toHaveBeenCalled();
		});
	});

	describe('debugEnabled', () => {
		it('should reflect current debug state', () => {
			setDebugEnabled(false);
			expect(debugEnabled).toBe(false);
			
			setDebugEnabled(true);
			expect(debugEnabled).toBe(true);
		});
	});
}); 