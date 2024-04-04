import {
  cleanEmptyValues,
  isJSON,
  transformObjectValues,
} from "@/services/json";

describe("JSON Service - isJSON", () => {
  it("returns true", async () => {
    const jsonString = JSON.stringify({ key: "value" });
    const result = isJSON(jsonString);

    expect(result).toBeTruthy();
  });
  it("returns false", async () => {
    const result = isJSON("invalid");

    expect(result).toBeFalsy();
  });
});

describe("JSON Service - transformObjectValues", () => {
  it("should transform all values", async () => {
    const objectToTransform = { a: "aaaa", b: "bbbb", c: "ccccc" };
    const result = transformObjectValues(
      objectToTransform,
      (value) => "transformed",
    );

    expect(result).toStrictEqual({
      a: "transformed",
      b: "transformed",
      c: "transformed",
    });
  });
  it("should transform nested", async () => {
    const objectToTransform = { a: { b: "bbbb", c: "ccccc" } };
    const result = transformObjectValues(
      objectToTransform,
      (value) => "transformed",
    );

    expect(result).toStrictEqual({
      a: "transformed",
    });
  });
});

describe("JSON Service - cleanEmptyValues", () => {
  it("should clean null values", async () => {
    const objectToTransform = { a: "aaaa", b: null, c: null };
    const result = cleanEmptyValues(objectToTransform);

    expect(result).toStrictEqual({
      a: "aaaa",
      b: undefined,
      c: undefined,
    });
  });
  it("should clean empty string values", async () => {
    const objectToTransform = { a: "aaaa", b: "", c: "" };
    const result = cleanEmptyValues(objectToTransform);

    expect(result).toStrictEqual({
      a: "aaaa",
      b: undefined,
      c: undefined,
    });
  });
  it("should clean null and empty string values", async () => {
    const objectToTransform = { a: "aaaa", b: null, c: "" };
    const result = cleanEmptyValues(objectToTransform);

    expect(result).toStrictEqual({
      a: "aaaa",
      b: undefined,
      c: undefined,
    });
  });
});
