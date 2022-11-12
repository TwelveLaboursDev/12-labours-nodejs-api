const { validateInput } = require("../supportFunction");

describe("check input validity", () => {
  test("should return true for input with numbers only", () => {
    expect(validateInput("1234567890")).toBe(true);
  });

  test("should return true for input with letters only", () => {
    expect(validateInput("abcdefg")).toBe(true);
  });

  test("should return true for input with both numbers, letters", () => {
    expect(validateInput("asdfg67890")).toBe(true);
  });

  test("should return true for input with email", () => {
    expect(validateInput("test@gmail.com")).toBe(true);
  });

  test("should return false for input with '", () => {
    expect(validateInput("qwertyuiop'")).toBe(false);
  });

  test('should return false for input with "', () => {
    expect(validateInput('asdfghjkl"')).toBe(false);
  });

  test("should return false for input with `", () => {
    expect(validateInput("zxcvbnm`")).toBe(false);
  });
});
