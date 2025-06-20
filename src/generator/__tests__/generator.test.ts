import { describe, it, expect } from "@jest/globals";
import { generate, generateWithStats } from "../generator";
import { isUnique } from "../uniqueness";
import { solve } from "../../core/solver";
import { isSolved } from "../../game/validation";
import { keys } from "../../utils";

describe("generator", () => {
  describe("generate", () => {
    it("should generate a valid easy puzzle", () => {
      const puzzle = generate("easy");

      expect(puzzle).toBeDefined();
      expect(typeof puzzle).toBe("object");

      // Should have approximately 35 squares for easy
      const filledSquares = keys(puzzle).length;
      expect(filledSquares).toBeGreaterThanOrEqual(30);
      expect(filledSquares).toBeLessThanOrEqual(40);
    });

    it("should generate a valid medium puzzle", () => {
      const puzzle = generate("medium");

      expect(puzzle).toBeDefined();
      expect(typeof puzzle).toBe("object");

      // Should have approximately 28 squares for medium
      const filledSquares = keys(puzzle).length;
      expect(filledSquares).toBeGreaterThanOrEqual(25);
      expect(filledSquares).toBeLessThanOrEqual(32);
    });

    it("should generate a valid hard puzzle", () => {
      const puzzle = generate("hard");

      expect(puzzle).toBeDefined();
      expect(typeof puzzle).toBe("object");

      // Should have approximately 20 squares for hard
      const filledSquares = keys(puzzle).length;
      expect(filledSquares).toBeGreaterThanOrEqual(17);
      expect(filledSquares).toBeLessThanOrEqual(25);
    });

    it("should default to easy difficulty", () => {
      const puzzle = generate();

      expect(puzzle).toBeDefined();
      const filledSquares = keys(puzzle).length;
      expect(filledSquares).toBeGreaterThanOrEqual(30);
      expect(filledSquares).toBeLessThanOrEqual(40);
    });

    it("should generate puzzles with unique solutions", () => {
      const puzzle = generate("easy");

      expect(isUnique(puzzle)).toBe(true);
    });

    it("should generate solvable puzzles", () => {
      const puzzle = generate("easy");
      const solution = solve(puzzle);

      expect(solution).toBeDefined();
      expect(solution).not.toBe(false);

      if (solution) {
        expect(isSolved(solution)).toBe(true);
      }
    });

    it("should generate different puzzles on multiple calls", () => {
      const puzzle1 = generate("easy");
      const puzzle2 = generate("easy");

      // Very unlikely to be identical
      expect(puzzle1).not.toEqual(puzzle2);
    });

    it("should respect difficulty constraints", () => {
      const easy = generate("easy");
      const medium = generate("medium");
      const hard = generate("hard");

      const easyCount = keys(easy).length;
      const mediumCount = keys(medium).length;
      const hardCount = keys(hard).length;

      // Generally, easier puzzles should have more filled squares
      expect(easyCount).toBeGreaterThan(mediumCount);
      expect(mediumCount).toBeGreaterThan(hardCount);
    });

    it("should generate puzzles with valid square names", () => {
      const puzzle = generate("easy");

      for (const square in puzzle) {
        // Square names should be like A1, B2, etc.
        expect(square).toMatch(/^[A-I][1-9]$/);

        // Values should be single digits
        expect(puzzle[square]).toMatch(/^[1-9]$/);
      }
    });

    it("should not generate empty puzzles", () => {
      const puzzle = generate("hard"); // Even hard should have some squares

      expect(keys(puzzle).length).toBeGreaterThan(0);
    });
  });

  describe("generateWithStats", () => {
    it("should return detailed generation information", () => {
      const result = generateWithStats("easy");

      expect(result).toHaveProperty("puzzle");
      expect(result).toHaveProperty("difficulty");
      expect(result).toHaveProperty("filledSquares");
      expect(result).toHaveProperty("generationTime");

      expect(result.difficulty).toBe("easy");
      expect(typeof result.filledSquares).toBe("number");
      expect(typeof result.generationTime).toBe("number");
      expect(result.generationTime).toBeGreaterThan(0);
    });

    it("should have consistent filled squares count", () => {
      const result = generateWithStats("medium");
      const actualCount = keys(result.puzzle).length;

      expect(result.filledSquares).toBe(actualCount);
    });

    it("should track generation time", () => {
      const result = generateWithStats("easy");

      expect(result.generationTime).toBeGreaterThan(0);
      expect(result.generationTime).toBeLessThan(30000); // Should complete within 30 seconds
    });

    it("should handle all difficulty levels", () => {
      const easy = generateWithStats("easy");
      const medium = generateWithStats("medium");
      const hard = generateWithStats("hard");

      expect(easy.difficulty).toBe("easy");
      expect(medium.difficulty).toBe("medium");
      expect(hard.difficulty).toBe("hard");

      // Verify difficulty ordering
      expect(easy.filledSquares).toBeGreaterThan(medium.filledSquares);
      expect(medium.filledSquares).toBeGreaterThan(hard.filledSquares);
    });

    it("should default to easy difficulty", () => {
      const result = generateWithStats();

      expect(result.difficulty).toBe("easy");
    });

    it("should generate valid puzzles", () => {
      const result = generateWithStats("medium");

      expect(isUnique(result.puzzle)).toBe(true);

      const solution = solve(result.puzzle);
      expect(solution).toBeDefined();
      expect(solution).not.toBe(false);
    });
  });
});
