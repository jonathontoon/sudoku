/**
 * Difficulty configuration for puzzle generation
 */

export type Difficulty = "easy" | "medium" | "hard";

/**
 * Get the target number of filled squares for a given difficulty level
 */
export function squareCount(difficulty: Difficulty = "easy"): number {
  switch (difficulty) {
    case "easy":
      return 35;
    case "medium":
      return 28;
    case "hard":
      return 20;
    default:
      return 35;
  }
}
