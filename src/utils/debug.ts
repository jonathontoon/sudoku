import { print } from './console';

/**
 * Debug utility functions
 */

/**
 * Configuration for debug logging
 */
export let debugEnabled = false;

/**
 * Enable or disable debug logging
 */
export function setDebugEnabled(enabled: boolean): void {
	debugEnabled = enabled;
}

/**
 * Log a debug message if debugging is enabled
 */
export function debug(msg: string): void {
	if (debugEnabled) {
		print(msg);
	}
} 