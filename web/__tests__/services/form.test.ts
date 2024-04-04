import protobuf from "protobufjs";
import {
  exportedForTesting,
  formTransformation,
  placeholderTransformation,
} from "@/services/form";
import sourceJson from "../data/helloworld.json";

const { getFieldPlaceholderValue, placeholderTransformationWithDepth } =
  exportedForTesting;

const context = protobuf.Root.fromJSON(JSON.parse(JSON.stringify(sourceJson)));
const type = context.lookupType("helloworld.TestRequest");

describe("Form Service - getFieldPlaceholderValue", () => {
  it("string === string", async () => {
    const field = new protobuf.Field("name", 1, "string").resolve();

    const result = getFieldPlaceholderValue(100, field);

    expect(result).toBe("string");
  });
  it("int32 === 0", async () => {
    const field = new protobuf.Field("name", 1, "int32").resolve();

    const result = getFieldPlaceholderValue(100, field);

    expect(result).toBe(0);
  });
  it("bytes === []", async () => {
    const field = new protobuf.Field("name", 1, "bytes").resolve();

    const result = getFieldPlaceholderValue(100, field);

    expect(result).toStrictEqual([]);
  });
  it("unknown === unknown", async () => {
    const field = new protobuf.Field("name", 1, "unknown");

    const result = getFieldPlaceholderValue(100, field);

    expect(result).toBe("unknown");
  });
  it("Enum === first value (0)", async () => {
    const field = type.fields["enum"].resolve();

    const result = getFieldPlaceholderValue(100, field);
    expect(result).toBe(0);
  });
  it("Message === one level deepness", async () => {
    const field = type.fields["any"].resolve();

    const result = getFieldPlaceholderValue(0, field);
    expect(result).toStrictEqual({
      type_url: "string",
      value: [],
    });
  });
  it("Array === first value", async () => {
    const field = type.fields["repeatedString"].resolve();

    const result = getFieldPlaceholderValue(0, field);

    expect(result).toBe("string");
  });
});

describe("Form Service - placeholderTransformationWithDepth", () => {
  it("string === string", async () => {
    const field = new protobuf.Field("name", 1, "string").resolve();

    const result = placeholderTransformationWithDepth(100, field);

    expect(result).toBe("string");
  });
  it("Array === [first value]", async () => {
    const field = type.fields["repeatedString"].resolve();

    const result = placeholderTransformationWithDepth(0, field);

    expect(result).toStrictEqual(["string"]);
  });
  it("Map === transform to object", async () => {
    const field = type.fields["map"].resolve();

    const result = placeholderTransformationWithDepth(0, field);

    expect(result).toStrictEqual({
      string: {
        type_url: "string",
        value: [],
      },
    });
  });
});

describe("Form Service - placeholderTransformation (without depth)", () => {
  it("string === string", async () => {
    const field = new protobuf.Field("name", 1, "string").resolve();

    const result = placeholderTransformation(field);

    expect(result).toBe("string");
  });
  it("Array === [first value]", async () => {
    const field = type.fields["repeatedString"].resolve();

    const result = placeholderTransformation(field);

    expect(result).toStrictEqual(["string"]);
  });
  it("Map === transform to object", async () => {
    const field = type.fields["map"].resolve();

    const result = placeholderTransformation(field);

    expect(result).toStrictEqual({
      string: {
        type_url: "string",
        value: [],
      },
    });
  });
});

describe("Form Service - formTransformation", () => {
  it('string === ""', async () => {
    const field = new protobuf.Field("name", 1, "string").resolve();

    const result = formTransformation(field);

    expect(result).toBe("");
  });
  it('int32 === ""', async () => {
    const field = new protobuf.Field("name", 1, "int32").resolve();

    const result = formTransformation(field);

    expect(result).toBe("");
  });
  it('Array === ""', async () => {
    const field = type.fields["repeatedString"].resolve();

    const result = formTransformation(field);

    expect(result).toBe("");
  });
  it('Map === ""', async () => {
    const field = type.fields["map"].resolve();

    const result = formTransformation(field);

    expect(result).toBe("");
  });
  it('Enum === ""', async () => {
    const field = type.fields["enum"].resolve();

    const result = formTransformation(field);
    expect(result).toBe("");
  });
  it("Message === { first level as string }", async () => {
    const field = type.fields["any"].resolve();

    const result = formTransformation(field);

    expect(result).toBe(
      JSON.stringify(
        {
          type_url: "string",
          value: [],
        },
        null,
        2,
      ),
    );
  });
});
