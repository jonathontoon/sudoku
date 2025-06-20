import { describe, it, expect } from "@jest/globals";
import {
  each,
  all,
  any,
  filter,
  some,
  map,
  randomElement,
  contains,
  shuffle,
  chars,
  cross,
} from "../array";

describe("Array utilities", () => {
  describe("each", () => {
    it("should iterate over all elements", () => {
      const result: number[] = [];
      each([1, 2, 3], (i, item) => {
        result.push(item * 2);
      });
      expect(result).toEqual([2, 4, 6]);
    });
  });

  describe("all", () => {
    it("should return true if all elements satisfy condition", () => {
      expect(all([2, 4, 6], (x) => x % 2 === 0)).toBe(true);
      expect(all([1, 2, 3], (x) => x % 2 === 0)).toBe(false);
    });
  });

  describe("any", () => {
    it("should return true if any element satisfies condition", () => {
      expect(any([1, 2, 3], (x) => x % 2 === 0)).toBe(true);
      expect(any([1, 3, 5], (x) => x % 2 === 0)).toBe(false);
    });
  });

  describe("filter", () => {
    it("should filter elements based on condition", () => {
      expect(filter([1, 2, 3, 4], (x) => x % 2 === 0)).toEqual([2, 4]);
    });
  });

  describe("some", () => {
    it("should return first truthy result", () => {
      expect(some([1, 2, 3], (x) => (x > 2 ? x : false))).toBe(3);
      expect(some([1, 2], (x) => (x > 3 ? x : false))).toBe(false);
    });
  });

  describe("map", () => {
    it("should transform elements with function", () => {
      expect(map([1, 2, 3], (x) => x * 2)).toEqual([2, 4, 6]);
    });

    it("should extract property with string", () => {
      const objects = [{ name: "a" }, { name: "b" }];
      expect(map(objects, "name")).toEqual(["a", "b"]);
    });
  });

  describe("randomElement", () => {
    it("should return an element from the array", () => {
      const arr = [1, 2, 3];
      const result = randomElement(arr);
      expect(arr).toContain(result);
    });
  });

  describe("contains", () => {
    it("should check if array contains value", () => {
      expect(contains([1, 2, 3], 2)).toBe(true);
      expect(contains([1, 2, 3], 4)).toBe(false);
    });
  });

  describe("shuffle", () => {
    it("should return array with same elements", () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffle(original);
      expect(shuffled).toHaveLength(original.length);
      expect(shuffled.sort()).toEqual(original.sort());
    });
  });

  describe("chars", () => {
    it("should convert string to character array", () => {
      expect(chars("abc")).toEqual(["a", "b", "c"]);
    });
  });

  describe("cross", () => {
    it("should create cross product", () => {
      expect(cross(["A", "B"], [1, 2])).toEqual(["A1", "A2", "B1", "B2"]);
    });
  });
});
