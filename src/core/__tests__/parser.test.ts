import { describe, it, expect } from "@jest/globals";
import { gridValues, parseGrid } from "../parser";
import { SQUARES, DIGITS } from "../constants";

describe("parser", () => {
  describe("gridValues", () => {
    it("should parse a simple grid string", () => {
      const grid =
        "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......";
      const result = gridValues(grid);

      // Grid is now in row-major order: A1, B1, C1, D1, E1, F1, G1, H1, I1, A2, B2, ...
      expect(result["A1"]).toBe("4"); // Position 0
      expect(result["G1"]).toBe("8"); // Position 6
      expect(result["I1"]).toBe("5"); // Position 8
      expect(result["B2"]).toBe("3"); // Position 10 (second row, second column)
    });

    it("should ignore non-digit and non-dot characters", () => {
      const grid =
        "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......";
      // Create a spaced version that maintains the same character positions
      const gridWithSpaces = grid.split("").join(" ");

      const result1 = gridValues(grid);
      const result2 = gridValues(gridWithSpaces);

      expect(result1).toEqual(result2);
    });

    it("should only include digits in result", () => {
      const grid =
        "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......";
      const result = gridValues(grid);

      // Check that only valid digits are included
      Object.values(result).forEach((value) => {
        expect(DIGITS).toContain(value);
      });
    });

    it("should handle empty/dot positions correctly", () => {
      // Use a proper 81-character grid with dots and digits
      const grid =
        "4.......................................................................8.......5";
      const result = gridValues(grid);

      expect(result["A1"]).toBe("4");
      expect(result["B1"]).toBeUndefined(); // Dot should not be included
      expect(result["A9"]).toBe("8"); // Position 72
      expect(result["I9"]).toBe("5"); // Position 80
    });

    it("should throw error for short grids", () => {
      const shortGrid = "4";
      expect(() => gridValues(shortGrid)).toThrow("Grid must be exactly 81 characters, got 1");
    });
  });

  describe("parseGrid", () => {
    it("should initialize all squares with all digits", () => {
      // Use a proper 81-character empty grid (all dots)
      const emptyGrid =
        ".................................................................................";
      const result = parseGrid(emptyGrid);

      expect(Object.keys(result)).toHaveLength(81);
      SQUARES.forEach((square) => {
        expect(result[square]).toBe(DIGITS);
      });
    });

    it("should handle string input", () => {
      const grid =
        "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......";
      const result = parseGrid(grid);

      expect(result).toBeTruthy();
      if (result) {
        expect(result["A1"]).toBe("4");
        expect(result["G1"]).toBe("8");
        expect(result["I1"]).toBe("5");
      }
    });

    it("should handle object input", () => {
      const gridObj = {
        A1: "4",
        G1: "8",
        I1: "5",
      };
      const result = parseGrid(gridObj);

      expect(result).toBeTruthy();
      if (result) {
        expect(result["A1"]).toBe("4");
        expect(result["G1"]).toBe("8");
        expect(result["I1"]).toBe("5");
      }
    });

    it("should work with assign function when provided", () => {
      const mockAssign = (values: Record<string, string>, s: string, d: string) => {
        values[s] = d;
        return values;
      };

      const gridObj = {
        A1: "4",
        B1: "7",
      };
      const result = parseGrid(gridObj, mockAssign);

      expect(result).toBeTruthy();
      if (result) {
        expect(result["A1"]).toBe("4");
        expect(result["B1"]).toBe("7");
      }
    });

    it("should return false when assign function fails", () => {
      const mockAssignFail = () => false as const;

      const gridObj = {
        A1: "4",
      };
      const result = parseGrid(gridObj, mockAssignFail);

      expect(result).toBe(false);
    });

    it("should ignore invalid digits", () => {
      const gridObj = {
        A1: "4",
        B1: "X", // Invalid
        C1: "0", // Invalid for Sudoku
        D1: "7",
      };
      const result = parseGrid(gridObj);

      expect(result).toBeTruthy();
      if (result) {
        expect(result["A1"]).toBe("4");
        expect(result["B1"]).toBe(DIGITS); // Should remain as all digits
        expect(result["C1"]).toBe(DIGITS); // Should remain as all digits
        expect(result["D1"]).toBe("7");
      }
    });
  });
});
