/**
 * Assert that a condition is true, throw an error if it's false.
 */
export const assert = (val: boolean, message?: string): void => {
  if (!val) {
    throw new Error(message || 'Assert failed');
  }
};

/**
 * Run a series of test cases and report results.
 */
export const runTestCases = (
  testCases: Array<{ name: string; test: () => boolean }>,
  description: string = 'Test Cases'
): void => {
  console.log(`\n=== Running ${description} ===`);
  let passed = 0;
  let failed = 0;

  for (const { name, test } of testCases) {
    try {
      if (test()) {
        console.log(`✓ ${name}`);
        passed++;
      } else {
        console.log(`✗ ${name}`);
        failed++;
      }
    } catch (error) {
      console.log(`✗ ${name} (Error: ${error})`);
      failed++;
    }
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    throw new Error(`${failed} test(s) failed`);
  }
};
