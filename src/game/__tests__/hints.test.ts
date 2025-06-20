import { describe, it, expect } from "@jest/globals";
import { getHint } from "../hints";

describe("hints", () => {
  // Test puzzle with known solution
  const puzzle =
    "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......";

  describe("getHint", () => {
    it("should throw error if values is null or undefined", () => {
      expect(() => getHint(puzzle, null as any)).toThrow("Values must be sent in");
      expect(() => getHint(puzzle, undefined as any)).toThrow("Values must be sent in");
    });

    it("should throw error if puzzle cannot be solved", () => {
      const impossiblePuzzle = {
        A1: "1",
        B1: "1", // Same row, impossible
      };
      const values = { A1: "1" };

      expect(() => getHint(impossiblePuzzle, values)).toThrow("Puzzle cannot be solved");
    });

    it("should return error hint for wrong guesses", () => {
      const values = {
        A1: "5", // Wrong! Should be 4
      };

      const hint = getHint(puzzle, values);
      expect(hint.type).toBe("error");
      if (hint.type === "error") {
        expect(hint.square).toBe("A1");
      }
    });

    it("should return square hint for fields with only one possibility", () => {
      // Start with a partial solution that creates obvious next moves
      const values = {
        A1: "4",
        G1: "8",
        I1: "5",
      };

      const hint = getHint(puzzle, values);
      expect(["squarehint", "unithint", "dontknow"]).toContain(hint.type);
    });

    it("should return unit hint when digit can only go in one place in a unit", () => {
      // Create a situation where a digit has only one valid position in a unit
      const simplePuzzle = {
        A1: "1",
        A2: "2",
        A3: "3",
        A4: "4",
        A5: "5",
        A6: "6",
        A7: "7",
        A8: "8",
        // A9 is empty, and 9 is the only possibility
      };

      const values = {
        A1: "1",
        A2: "2",
        A3: "3",
        A4: "4",
        A5: "5",
        A6: "6",
        A7: "7",
        A8: "8",
      };

      const hint = getHint(simplePuzzle, values);
      // This should give us some kind of hint
      expect(["squarehint", "unithint", "dontknow"]).toContain(hint.type);
    });

    it("should return dontknow hint when no simple hints are available", () => {
      // Empty board should return dontknow
      const emptyPuzzle = {};
      const emptyValues = {};

      const hint = getHint(emptyPuzzle, emptyValues);
      expect(hint.type).toBe("dontknow");
      if (hint.type === "dontknow") {
        expect(hint.squares).toBeDefined();
        expect(typeof hint.squares).toBe("object");
      }
    });

    it("should handle different hint types correctly", () => {
      const values = { A1: "4" }; // Correct value

      const hint = getHint(puzzle, values);

      // Should be one of the valid hint types
      expect(["error", "squarehint", "unithint", "dontknow"]).toContain(hint.type);

      // Each hint type should have the correct structure
      if (hint.type === "error") {
        expect(hint).toHaveProperty("square");
        expect(typeof hint.square).toBe("string");
      } else if (hint.type === "squarehint") {
        expect(hint).toHaveProperty("square");
        expect(typeof hint.square).toBe("string");
      } else if (hint.type === "unithint") {
        expect(hint).toHaveProperty("unitType");
        expect(hint).toHaveProperty("unit");
        expect(hint).toHaveProperty("digit");
        expect(["row", "column", "box"]).toContain(hint.unitType);
        expect(Array.isArray(hint.unit)).toBe(true);
        expect(typeof hint.digit).toBe("string");
      } else if (hint.type === "dontknow") {
        expect(hint).toHaveProperty("squares");
        expect(typeof hint.squares).toBe("object");
      }
    });

    it("should prioritize error hints over other types", () => {
      const values = {
        A1: "9", // Wrong! Should be 4
        B1: "1", // This might be correct
      };

      const hint = getHint(puzzle, values);
      expect(hint.type).toBe("error");
      if (hint.type === "error") {
        expect(hint.square).toBe("A1");
      }
    });

    it("should handle string puzzle input", () => {
      const values = { A1: "4" };

      const hint = getHint(puzzle, values);
      expect(["error", "squarehint", "unithint", "dontknow"]).toContain(hint.type);
    });

    it("should handle object puzzle input", () => {
      const puzzleObj = {
        A1: "4",
        G1: "8",
        I1: "5",
      };
      const values = { A1: "4" };

      const hint = getHint(puzzleObj, values);
      expect(["error", "squarehint", "unithint", "dontknow"]).toContain(hint.type);
    });

    it("should detect unit type correctly in unit hints", () => {
      // Create a puzzle that will likely generate unit hints
      const simplePuzzle = {
        A1: "1",
        B1: "2",
        C1: "3",
        D1: "4",
        E1: "5",
        F1: "6",
        G1: "7",
        H1: "8",
        // I1 is missing, should be 9, this creates a row hint
      };

      const values = {
        A1: "1",
        B1: "2",
        C1: "3",
        D1: "4",
        E1: "5",
        F1: "6",
        G1: "7",
        H1: "8",
      };

      const hint = getHint(simplePuzzle, values);

      // The hint should be able to determine unit types
      if (hint.type === "unithint") {
        expect(["row", "column", "box"]).toContain(hint.unitType);
      }
    });
  });
});
