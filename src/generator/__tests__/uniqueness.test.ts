import { describe, it, expect } from "@jest/globals";
import { isUnique } from "../uniqueness";

describe("uniqueness", () => {
  describe("isUnique", () => {
    it("should return true for a puzzle with unique solution", () => {
      // A known puzzle with unique solution
      const uniquePuzzle =
        "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......";

      const result = isUnique(uniquePuzzle);
      expect(result).toBe(true);
    });

    it("should handle object puzzle input", () => {
      // Use the same puzzle as the string test
      const puzzleString =
        "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......";
      const puzzleObj: any = {};

      // Convert string to object format for testing
      for (let i = 0; i < puzzleString.length; i++) {
        const char = puzzleString[i];
        if (char !== "." && char !== "0") {
          const row = Math.floor(i / 9) + 1;
          const col = String.fromCharCode(65 + (i % 9)); // A-I
          puzzleObj[col + row] = char;
        }
      }

      const result = isUnique(puzzleObj);
      expect(typeof result).toBe("boolean");
    });

    it("should handle string puzzle input", () => {
      const puzzleString =
        "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......";

      const result = isUnique(puzzleString);
      expect(typeof result).toBe("boolean");
    });

    it("should throw error for unsolvable puzzles", () => {
      const impossiblePuzzle = {
        A1: "1",
        B1: "1", // Same row, impossible
      };

      expect(() => isUnique(impossiblePuzzle)).toThrow("Failed to solve puzzle");
    });

    it("should return false for puzzles with multiple solutions", () => {
      // A very minimal puzzle that likely has multiple solutions
      const minimalPuzzle = {
        A1: "1",
      };

      const result = isUnique(minimalPuzzle);
      expect(result).toBe(false);
    });

    it("should return false for empty puzzle (has multiple solutions)", () => {
      // Empty puzzle has multiple possible solutions
      const emptyPuzzle = {};

      const result = isUnique(emptyPuzzle);
      expect(result).toBe(false);
    });

    it("should handle partially filled puzzles", () => {
      const partialPuzzle = {
        A1: "1",
        A2: "2",
        A3: "3",
        B1: "4",
        B2: "5",
        B3: "6",
        C1: "7",
        C2: "8",
        C3: "9",
      };

      const result = isUnique(partialPuzzle);
      expect(typeof result).toBe("boolean");
    });

    it("should be consistent across multiple calls", () => {
      const puzzle =
        "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......";

      const result1 = isUnique(puzzle);
      const result2 = isUnique(puzzle);
      const result3 = isUnique(puzzle);

      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
    });

    it("should handle well-formed puzzles correctly", () => {
      // A puzzle that should have a unique solution
      const wellFormedPuzzle =
        "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79";

      const result = isUnique(wellFormedPuzzle);
      expect(result).toBe(true);
    });

    it("should detect non-unique puzzles", () => {
      // A puzzle with too few clues to be unique
      const nonUniquePuzzle = {
        A1: "1",
        E5: "5",
        I9: "9",
      };

      const result = isUnique(nonUniquePuzzle);
      expect(result).toBe(false);
    });
  });
});
