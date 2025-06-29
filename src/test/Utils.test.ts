import { getStringInfo, StringUtils, toUpperCase } from "../app/Utils";

describe("utils test suite", () => {
  describe("Utils test suite", () => {
    let sut: StringUtils;

    beforeEach(() => {
      sut = new StringUtils();
    });

    it("should return correct UpperCase", () => {
      const actual = sut.toUpperCase("abc");
      expect(actual).toBe("ABC");
    });

    it("should throw error on invalid argument - function", () => {
      function expectError() {
        const actual = sut.toUpperCase("");
      }
      expect(expectError).toThrow();
      expect(expectError).toThrow("Invalid argument!");
    });

    it("should throw error on invalid argument - arrow function", () => {
      expect(() => {
        sut.toUpperCase("");
      }).toThrow("Invalid argument!");
    });

    it("should throw error on invalid argument - try catch block", (done) => {
      try {
        sut.toUpperCase("");
        done("GetStringIngo should throw error for invalid arg!");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty("message", "Invalid argument!");
        done();
      }
    });
  });

  it("should return uppercase of a valid string", () => {
    const sut = toUpperCase;
    const expected = "ABC";

    const actual = sut("abc");

    expect(actual).toBe(expected);
  });

  describe("ToUpperCase example", () => {
    it.each([
      { input: "abc", expected: "ABC" },
      { input: "My-String", expected: "MY-STRING" },
      { input: "def", expected: "DEF" },
    ])("$input toUpperCase should be $expected", ({ input, expected }) => {
      const actual = toUpperCase(input);
      expect(actual).toBe(expected);
    });
  });

  describe("getStringInfo for arg My-String should", () => {
    test("return right length", () => {
      const actual = getStringInfo("My-String");
      expect(actual.characters).toHaveLength(9);
    });

    test("return right lower case", () => {
      const actual = getStringInfo("My-String");
      expect(actual.lowerCase).toBe("my-string");
    });

    test("return right upper case", () => {
      const actual = getStringInfo("My-String");
      expect(actual.upperCase).toBe("MY-STRING");
    });

    test("return right characters", () => {
      const actual = getStringInfo("My-String");
      expect(actual.characters).toEqual([
        "M",
        "y",
        "-",
        "S",
        "t",
        "r",
        "i",
        "n",
        "g",
      ]);
      expect(actual.characters).toContain<string>("M");
      expect(actual.characters).toEqual(
        expect.arrayContaining(["M", "y", "-", "S", "t", "r", "i", "n", "g"])
      );
    });

    test("return defined extra info", () => {
      const actual = getStringInfo("My-String");
      expect(actual.extraInfo).toBeDefined();
    });

    test("return right extra info", () => {
      const actual = getStringInfo("My-String");
      expect(actual.extraInfo).toEqual({});
    });
  });
});
