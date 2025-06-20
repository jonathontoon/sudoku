import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";
import { print } from "../console";

describe("Console utilities", () => {
  let consoleSpy: ReturnType<typeof jest.spyOn>;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe("print", () => {
    it("should call console.log with message and carriage return + newline", () => {
      print("test message");
      expect(consoleSpy).toHaveBeenCalledWith("test message\r\n");
    });

    it("should handle empty string", () => {
      print("");
      expect(consoleSpy).toHaveBeenCalledWith("\r\n");
    });

    it("should handle special characters", () => {
      const message = "Hello\tWorld!";
      print(message);
      expect(consoleSpy).toHaveBeenCalledWith("Hello\tWorld!\r\n");
    });
  });
});
