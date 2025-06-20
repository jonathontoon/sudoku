import { describe, it, expect } from "@jest/globals";
import { assert } from "../assert";

describe("assert", () => {
  it("should not throw for truthy values", () => {
    expect(() => assert(true)).not.toThrow();
    expect(() => assert(1)).not.toThrow();
    expect(() => assert("hello")).not.toThrow();
    expect(() => assert([])).not.toThrow();
    expect(() => assert({})).not.toThrow();
  });

  it('should throw "Assert failed" for falsy values without custom message', () => {
    expect(() => assert(false)).toThrow("Assert failed");
    expect(() => assert(0)).toThrow("Assert failed");
    expect(() => assert("")).toThrow("Assert failed");
    expect(() => assert(null)).toThrow("Assert failed");
    expect(() => assert(undefined)).toThrow("Assert failed");
  });

  it("should throw custom error message when provided", () => {
    expect(() => assert(false, "Custom error message")).toThrow("Custom error message");
    expect(() => assert(0, "Value should not be zero")).toThrow("Value should not be zero");
    expect(() => assert(null, "Value is null")).toThrow("Value is null");
  });

  it("should throw Error (not custom error class)", () => {
    try {
      assert(false);
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe("Assert failed");
    }

    try {
      assert(false, "Custom message");
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe("Custom message");
    }
  });
});
