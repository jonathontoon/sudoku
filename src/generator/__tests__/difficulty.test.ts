import { describe, it, expect } from "@jest/globals";
import { squareCount, Difficulty } from "../difficulty";

describe("difficulty", () => {
  describe("squareCount", () => {
    it("should return 35 for easy difficulty", () => {
      expect(squareCount("easy")).toBe(35);
    });

    it("should return 28 for medium difficulty", () => {
      expect(squareCount("medium")).toBe(28);
    });

    it("should return 20 for hard difficulty", () => {
      expect(squareCount("hard")).toBe(20);
    });

    it("should default to easy (35) when no difficulty provided", () => {
      expect(squareCount()).toBe(35);
    });

    it("should handle all valid difficulty types", () => {
      const difficulties: Difficulty[] = ["easy", "medium", "hard"];

      difficulties.forEach((difficulty) => {
        const count = squareCount(difficulty);
        expect(typeof count).toBe("number");
        expect(count).toBeGreaterThan(0);
        expect(count).toBeLessThan(81);
      });
    });

    it("should return different values for different difficulties", () => {
      const easy = squareCount("easy");
      const medium = squareCount("medium");
      const hard = squareCount("hard");

      expect(easy).toBeGreaterThan(medium);
      expect(medium).toBeGreaterThan(hard);
    });

    it("should return reasonable values for puzzle generation", () => {
      expect(squareCount("easy")).toBeGreaterThanOrEqual(30);
      expect(squareCount("easy")).toBeLessThanOrEqual(40);

      expect(squareCount("medium")).toBeGreaterThanOrEqual(25);
      expect(squareCount("medium")).toBeLessThanOrEqual(35);

      expect(squareCount("hard")).toBeGreaterThanOrEqual(17);
      expect(squareCount("hard")).toBeLessThanOrEqual(25);
    });
  });
});
