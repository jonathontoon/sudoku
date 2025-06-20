import { describe, it, expect } from "@jest/globals";
import { serialize, deserialize } from "../serialization";
import { SQUARES } from "../constants";

describe("serialization", () => {
  describe("serialize", () => {
    it("should serialize an empty puzzle", () => {
      const emptyPuzzle = {};
      const result = serialize(emptyPuzzle);

      // Empty puzzle should be all 'x' characters, which compress to 'f' characters
      // 81 empty squares = 13 groups of 6 + 3 remaining = 13 'f' + 'c'
      expect(result).toBe("fffffffffffffc"); // 13 f's + 1 c (for 3 remaining)
    });

    it("should serialize a puzzle with some filled squares", () => {
      const puzzle = {
        A1: "4",
        G1: "8",
        I1: "5",
      };

      const result = serialize(puzzle);
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBeLessThan(81); // Should be compressed
    });

    it("should serialize a complete puzzle", () => {
      const completePuzzle: Record<string, string> = {};
      for (let i = 0; i < SQUARES.length; i++) {
        completePuzzle[SQUARES[i]] = ((i % 9) + 1).toString();
      }

      const result = serialize(completePuzzle);
      expect(result).toHaveLength(81); // No compression needed
      expect(result).not.toContain("a"); // No empty squares
      expect(result).not.toContain("x"); // No empty squares
    });

    it("should handle puzzles with different empty patterns", () => {
      const puzzle1 = { A1: "1" }; // 80 empty squares
      const puzzle2 = { A1: "1", A2: "2" }; // 79 empty squares

      const result1 = serialize(puzzle1);
      const result2 = serialize(puzzle2);

      expect(result1).not.toBe(result2);
      expect(typeof result1).toBe("string");
      expect(typeof result2).toBe("string");
    });

    it("should use run-length encoding for consecutive empty squares", () => {
      // Create a puzzle with exactly 6 empty squares at the start
      const puzzle: Record<string, string> = {};
      for (let i = 6; i < SQUARES.length; i++) {
        puzzle[SQUARES[i]] = "1";
      }

      const result = serialize(puzzle);
      expect(result.startsWith("f")).toBe(true); // 6 empty squares -> 'f'
    });

    it("should handle mixed patterns correctly", () => {
      const puzzle = {
        A1: "1",
        // A2, A3 empty (2 empty -> 'b')
        A4: "4",
        // A5 empty (1 empty -> 'a')
        A6: "6",
      };

      const result = serialize(puzzle);
      expect(result).toContain("1");
      expect(result).toContain("4");
      expect(result).toContain("6");
    });
  });

  describe("deserialize", () => {
    it("should deserialize an empty puzzle", () => {
      const serialized = "fffffffffffffc"; // All empty squares
      const result = deserialize(serialized);

      expect(result).toEqual({});
      expect(Object.keys(result)).toHaveLength(0);
    });

    it("should deserialize a simple puzzle", () => {
      // Create a simple serialized format: '4' followed by compressed empty squares
      const puzzle = { A1: "4" };
      const serialized = serialize(puzzle);
      const result = deserialize(serialized);

      expect(result).toEqual(puzzle);
    });

    it("should deserialize a complete puzzle", () => {
      const originalPuzzle: Record<string, string> = {};
      for (let i = 0; i < SQUARES.length; i++) {
        originalPuzzle[SQUARES[i]] = ((i % 9) + 1).toString();
      }

      const serialized = serialize(originalPuzzle);
      const result = deserialize(serialized);

      expect(result).toEqual(originalPuzzle);
    });

    it("should handle run-length encoded patterns", () => {
      // Test specific compression patterns
      const testCases = [
        "a", // 1 empty square
        "b", // 2 empty squares
        "c", // 3 empty squares
        "d", // 4 empty squares
        "e", // 5 empty squares
        "f", // 6 empty squares
      ];

      testCases.forEach((encoded, index) => {
        const expectedEmptyCount = index + 1;
        const fullEncoded = encoded + "1".repeat(81 - expectedEmptyCount);
        const result = deserialize(fullEncoded);

        expect(Object.keys(result)).toHaveLength(81 - expectedEmptyCount);
      });
    });

    it("should handle mixed compression patterns", () => {
      // Test a mix of different compression patterns
      const serialized = "1ba2c3d4e5f6"; // Various patterns
      const result = deserialize(serialized);

      expect(typeof result).toBe("object");
      expect(result["A1"]).toBe("1");
      expect(result["A2"]).toBeUndefined(); // Empty (from 'a')
      expect(result["A3"]).toBeUndefined(); // Empty (from 'b')
      expect(result["A4"]).toBeUndefined(); // Empty (from 'b')
      expect(result["E1"]).toBe("2"); // Position 5 (after 1xxx)
    });

    it("should handle short serialized strings", () => {
      const serialized = "1234567890"; // Only digits, no compression, shorter than 81
      const result = deserialize(serialized);

      expect(Object.keys(result)).toHaveLength(10);
      expect(result["A1"]).toBe("1");
      expect(result["B1"]).toBe("2");
      expect(result["C1"]).toBe("3");
      expect(result["D1"]).toBe("4");
      expect(result["E1"]).toBe("5");
    });
  });

  describe("round-trip serialization", () => {
    it("should maintain data integrity through serialize/deserialize cycle", () => {
      const originalPuzzle = {
        A1: "4",
        G1: "8",
        I1: "5",
        B2: "3",
        H3: "7",
        D4: "2",
        G5: "8",
        I5: "4",
        H6: "1",
        H7: "6",
        I7: "3",
        B8: "7",
        D8: "5",
        F8: "2",
        H9: "1",
        I9: "4",
      };

      const serialized = serialize(originalPuzzle);
      const deserialized = deserialize(serialized);

      expect(deserialized).toEqual(originalPuzzle);
    });

    it("should handle empty puzzle round-trip", () => {
      const emptyPuzzle = {};

      const serialized = serialize(emptyPuzzle);
      const deserialized = deserialize(serialized);

      expect(deserialized).toEqual(emptyPuzzle);
    });

    it("should handle complete puzzle round-trip", () => {
      const completePuzzle: Record<string, string> = {};
      for (let i = 0; i < SQUARES.length; i++) {
        completePuzzle[SQUARES[i]] = ((i % 9) + 1).toString();
      }

      const serialized = serialize(completePuzzle);
      const deserialized = deserialize(serialized);

      expect(deserialized).toEqual(completePuzzle);
    });

    it("should handle various puzzle sizes", () => {
      const testSizes = [1, 5, 10, 20, 35, 50, 70, 81];

      testSizes.forEach((size) => {
        const puzzle: Record<string, string> = {};
        for (let i = 0; i < size; i++) {
          puzzle[SQUARES[i]] = ((i % 9) + 1).toString();
        }

        const serialized = serialize(puzzle);
        const deserialized = deserialize(serialized);

        expect(deserialized).toEqual(puzzle);
        expect(Object.keys(deserialized)).toHaveLength(size);
      });
    });

    it("should produce consistent serialization for same input", () => {
      const puzzle = {
        A1: "1",
        E5: "5",
        I9: "9",
      };

      const serialized1 = serialize(puzzle);
      const serialized2 = serialize(puzzle);
      const serialized3 = serialize(puzzle);

      expect(serialized1).toBe(serialized2);
      expect(serialized2).toBe(serialized3);
    });

    it("should compress effectively for sparse puzzles", () => {
      const sparsePuzzle = {
        A1: "1",
        E5: "5",
        I9: "9",
      };

      const serialized = serialize(sparsePuzzle);

      // Should be much shorter than 81 characters due to compression
      expect(serialized.length).toBeLessThan(30);
      expect(serialized.length).toBeGreaterThan(0);
    });
  });
});
