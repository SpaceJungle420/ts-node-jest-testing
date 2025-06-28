import { toUpperCase } from "../app/Utils";

describe("utils test suite", () => {
  test("should return uppercase", () => {
    const result = toUpperCase("abc");
    expect(result).toBe("ABC");
  });
});
