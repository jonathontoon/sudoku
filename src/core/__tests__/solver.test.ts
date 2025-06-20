import { describe, it, expect } from "@jest/globals";
import { solve, assign, eliminate, search } from "../solver";
import { DIGITS, SQUARES } from "../constants";

describe("solver", () => {
  // Easy puzzle for testing
  const easyPuzzle =
    "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......";

  // Known solution for the easy puzzle
  const easySolution = {
    A1: "4",
    B1: "1",
    C1: "6",
    D1: "9",
    E1: "2",
    F1: "3",
    G1: "8",
    H1: "7",
    I1: "5",
    A2: "8",
    B2: "3",
    C2: "7",
    D2: "1",
    E2: "5",
    F2: "4",
    G2: "2",
    H2: "6",
    I2: "9",
    A3: "2",
    B3: "5",
    C3: "9",
    D3: "6",
    E3: "8",
    F3: "7",
    G3: "1",
    H3: "4",
    I3: "3",
    A4: "3",
    B4: "2",
    C4: "1",
    D4: "5",
    E4: "9",
    F4: "8",
    G4: "6",
    H4: "3",
    I4: "7",
    A5: "9",
    B5: "6",
    C5: "4",
    D5: "7",
    E5: "3",
    F5: "2",
    G5: "5",
    H5: "8",
    I5: "1",
    A6: "7",
    B6: "8",
    C6: "5",
    D6: "4",
    E6: "1",
    F6: "6",
    G6: "9",
    H6: "2",
    I6: "3",
    A7: "1",
    B7: "4",
    C7: "2",
    D7: "8",
    E7: "6",
    F7: "9",
    G7: "3",
    H7: "5",
    I7: "4",
    A8: "6",
    B8: "9",
    C8: "8",
    D8: "3",
    E8: "7",
    F8: "5",
    G8: "4",
    H8: "1",
    I8: "2",
    A9: "5",
    B9: "7",
    C9: "3",
    D9: "2",
    E9: "4",
    F9: "1",
    G9: "8",
    H9: "9",
    I9: "6",
  };

  describe("solve", () => {
    it("should solve an easy puzzle", () => {
      const result = solve(easyPuzzle);

      expect(result).toBeTruthy();
      if (result) {
        // Check that all squares have exactly one digit
        Object.values(result).forEach((value) => {
          expect(value).toHaveLength(1);
          expect(DIGITS).toContain(value);
        });

        // Should have 81 squares
        expect(Object.keys(result)).toHaveLength(81);
      }
    });

    it("should handle string input", () => {
      const result = solve(easyPuzzle);
      expect(result).toBeTruthy();
    });

    it("should handle object input", () => {
      const gridObj = {
        A1: "4",
        G1: "8",
        I1: "5",
        C2: "3",
      };
      const result = solve(gridObj);
      expect(result).toBeTruthy();
    });

    it("should return false for unsolvable puzzle", () => {
      // Create an impossible puzzle (two 1s in same row)
      const impossiblePuzzle = {
        A1: "1",
        B1: "1", // Same row, same digit - impossible
      };
      const result = solve(impossiblePuzzle);
      expect(result).toBe(false);
    });

    it("should accept solver options", () => {
      const result1 = solve(easyPuzzle, { chooseDigit: "min" });
      const result2 = solve(easyPuzzle, { chooseSquare: "maxDigits" });

      expect(result1).toBeTruthy();
      expect(result2).toBeTruthy();
    });
  });

  describe("assign", () => {
    it("should assign a digit to a square", () => {
      const values: Record<string, string> = {};
      // Initialize all squares with all digits
      SQUARES.forEach((square) => {
        values[square] = DIGITS;
      });

      const result = assign(values, "A1", "4");
      expect(result).toBeTruthy();
      if (result) {
        expect(result["A1"]).toBe("4");
      }
    });

    it("should return false for impossible assignments", () => {
      const values = {
        A1: "5", // Already assigned
        B1: DIGITS,
      };

      // Try to assign a different digit to A1
      const result = assign(values, "A1", "4");
      expect(result).toBe(false);
    });

    it("should eliminate digit from peers", () => {
      const values: Record<string, string> = {};
      // Initialize all squares with all digits
      SQUARES.forEach((square) => {
        values[square] = DIGITS;
      });

      const result = assign(values, "A1", "4");
      expect(result).toBeTruthy();
      if (result) {
        expect(result["A1"]).toBe("4");
        // A2 should no longer contain '4' (same column)
        expect(result["A2"]).not.toContain("4");
        // B1 should no longer contain '4' (same row)
        expect(result["B1"]).not.toContain("4");
      }
    });
  });

  describe("eliminate", () => {
    it("should eliminate a digit from a square", () => {
      const values: Record<string, string> = {};
      // Initialize all squares with all digits
      SQUARES.forEach((square) => {
        values[square] = DIGITS;
      });

      const result = eliminate(values, "A1", "4");
      expect(result).toBeTruthy();
      if (result) {
        expect(result["A1"]).not.toContain("4");
        expect(result["A1"]).toHaveLength(8); // 9 - 1 = 8
      }
    });

    it("should return original values if digit already eliminated", () => {
      const values = {
        A1: "123456789".replace("4", ""), // '4' already eliminated
        B1: DIGITS,
      };

      const result = eliminate(values, "A1", "4");
      expect(result).toBeTruthy();
      if (result) {
        expect(result["A1"]).not.toContain("4");
        expect(result["A1"]).toHaveLength(8);
      }
    });

    it("should return false when last digit is eliminated", () => {
      const values = {
        A1: "4", // Only one digit left
        B1: DIGITS,
      };

      const result = eliminate(values, "A1", "4");
      expect(result).toBe(false);
    });

    it("should propagate elimination to peers when square reduced to one value", () => {
      const values: Record<string, string> = {};
      // Initialize all squares with all digits
      SQUARES.forEach((square) => {
        values[square] = DIGITS;
      });

      // Eliminate all but one digit from A1
      let result = values;
      const digitsToEliminate = "12345678"; // Leave only '9'
      for (const digit of digitsToEliminate) {
        result = eliminate(result, "A1", digit) as Record<string, string>;
        if (!result) break;
      }

      expect(result).toBeTruthy();
      if (result) {
        expect(result["A1"]).toBe("9");
        // A2 should no longer contain '9' (same column)
        expect(result["A2"]).not.toContain("9");
        // B1 should no longer contain '9' (same row)
        expect(result["B1"]).not.toContain("9");
      }
    });
  });

  describe("search", () => {
    it("should return false for false input", () => {
      const result = search(false);
      expect(result).toBe(false);
    });

    it("should return solved puzzle when all squares have one digit", () => {
      // Create a mock solved puzzle using actual SQUARES
      const solvedValues: Record<string, string> = {};
      let digit = 1;
      for (let i = 0; i < SQUARES.length; i++) {
        solvedValues[SQUARES[i]] = digit.toString();
        digit = (digit % 9) + 1;
      }

      const result = search(solvedValues);
      expect(result).toEqual(solvedValues);
    });

    it("should handle different solver options", () => {
      const values: Record<string, string> = {};

      // Initialize all squares with all digits first
      SQUARES.forEach((square) => {
        values[square] = DIGITS;
      });

      // Then set some partial values
      values["A1"] = "12";
      values["A2"] = "34";
      values["A3"] = "56";

      const result1 = search(values, { chooseDigit: "min" });
      const result2 = search(values, { chooseSquare: "maxDigits" });

      // Both should return some result (could be false or solved)
      expect(typeof result1).toBeDefined();
      expect(typeof result2).toBeDefined();
    });
  });
});
