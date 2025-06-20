import { describe, it, expect } from "@jest/globals";
import { ROWS, COLS, DIGITS, SQUARES, UNITLIST, UNITS, PEERS } from "../constants";

describe("constants", () => {
  describe("basic constants", () => {
    it("should have correct ROWS", () => {
      expect(ROWS).toEqual(["1", "2", "3", "4", "5", "6", "7", "8", "9"]);
    });

    it("should have correct COLS", () => {
      expect(COLS).toEqual(["A", "B", "C", "D", "E", "F", "G", "H", "I"]);
    });

    it("should have correct DIGITS", () => {
      expect(DIGITS).toBe("123456789");
    });
  });

  describe("SQUARES", () => {
    it("should have 81 squares", () => {
      expect(SQUARES).toHaveLength(81);
    });

    it("should start with A1 and end with I9", () => {
      expect(SQUARES[0]).toBe("A1");
      expect(SQUARES[80]).toBe("I9");
    });

    it("should contain all valid square names", () => {
      // Check a few specific squares
      expect(SQUARES).toContain("A1");
      expect(SQUARES).toContain("E5"); // Center square
      expect(SQUARES).toContain("I9");
      expect(SQUARES).toContain("D7");
    });
  });

  describe("UNITLIST", () => {
    it("should have 27 units total", () => {
      expect(UNITLIST).toHaveLength(27);
    });

    it("should have 9 row units", () => {
      const rowUnits = UNITLIST.slice(0, 9);
      expect(rowUnits).toHaveLength(9);
      // Check first row
      expect(rowUnits[0]).toEqual(["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1", "I1"]);
    });

    it("should have 9 column units", () => {
      const colUnits = UNITLIST.slice(9, 18);
      expect(colUnits).toHaveLength(9);
      // Check first column
      expect(colUnits[0]).toEqual(["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9"]);
    });

    it("should have 9 box units", () => {
      const boxUnits = UNITLIST.slice(18, 27);
      expect(boxUnits).toHaveLength(9);
      // Check top-left box
      expect(boxUnits[0]).toEqual(["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"]);
    });

    it("each unit should have exactly 9 squares", () => {
      UNITLIST.forEach((unit) => {
        expect(unit).toHaveLength(9);
      });
    });
  });

  describe("UNITS", () => {
    it("should have entries for all 81 squares", () => {
      expect(Object.keys(UNITS)).toHaveLength(81);
    });

    it("each square should belong to exactly 3 units", () => {
      SQUARES.forEach((square) => {
        expect(UNITS[square]).toHaveLength(3);
      });
    });

    it("A1 should belong to correct units", () => {
      const a1Units = UNITS["A1"];
      expect(a1Units).toHaveLength(3);

      // Should be in row 1, column A, and top-left box
      expect(a1Units[0]).toEqual(["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1", "I1"]); // Row
      expect(a1Units[1]).toEqual(["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9"]); // Column
      expect(a1Units[2]).toEqual(["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"]); // Box
    });

    it("E5 (center) should belong to correct units", () => {
      const e5Units = UNITS["E5"];
      expect(e5Units).toHaveLength(3);

      // Should be in row 5, column E, and center box
      expect(e5Units[0]).toEqual(["A5", "B5", "C5", "D5", "E5", "F5", "G5", "H5", "I5"]); // Row
      expect(e5Units[1]).toEqual(["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9"]); // Column
      expect(e5Units[2]).toEqual(["D4", "D5", "D6", "E4", "E5", "E6", "F4", "F5", "F6"]); // Box
    });
  });

  describe("PEERS", () => {
    it("should have entries for all 81 squares", () => {
      expect(Object.keys(PEERS)).toHaveLength(81);
    });

    it("each square should have exactly 20 peers", () => {
      SQUARES.forEach((square) => {
        expect(PEERS[square]).toHaveLength(20);
      });
    });

    it("A1 peers should not include A1 itself", () => {
      expect(PEERS["A1"]).not.toContain("A1");
    });

    it("A1 should have correct peers", () => {
      const a1Peers = PEERS["A1"];

      // Should include all other squares in its row, column, and box
      // Row peers (excluding A1): B1, C1, D1, E1, F1, G1, H1, I1 = 8
      // Column peers (excluding A1): A2, A3, A4, A5, A6, A7, A8, A9 = 8
      // Box peers (excluding A1 and already counted): B2, B3, C2, C3 = 4
      // Total = 8 + 8 + 4 = 20

      expect(a1Peers).toContain("B1"); // Row peer
      expect(a1Peers).toContain("A2"); // Column peer
      expect(a1Peers).toContain("B2"); // Box peer
      expect(a1Peers).toContain("I1"); // Row peer
      expect(a1Peers).toContain("A9"); // Column peer
      expect(a1Peers).toContain("C3"); // Box peer
    });

    it("peers should be symmetric", () => {
      // If A is a peer of B, then B should be a peer of A
      const testSquares = ["A1", "E5", "I9"];
      testSquares.forEach((square) => {
        PEERS[square].forEach((peer) => {
          expect(PEERS[peer]).toContain(square);
        });
      });
    });
  });
});
