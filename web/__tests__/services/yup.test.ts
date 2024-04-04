import { getFieldYupType } from "@/services/yup";
import { type } from "../../tests/protobufjs-source";

describe("yup Service - getFieldYupType", () => {
  it("string === string, null", async () => {
    const field = type.fields["string"].resolve();

    const schema = getFieldYupType(field);

    expect(await schema.isValid(null)).toEqual(true);
    expect(await schema.isValid("")).toEqual(true);

    expect(await schema.isValid({})).toEqual(false);
  });
  it("bytes === object, null", async () => {
    const field = type.fields["bytes"].resolve();

    const schema = getFieldYupType(field);

    expect(await schema.isValid(null)).toEqual(true);
    expect(await schema.isValid(new Uint8Array())).toEqual(true);
    expect(await schema.isValid([])).toEqual(true);
  });
  it("number === number, null", async () => {
    const field = type.fields["number"].resolve();

    const schema = getFieldYupType(field);

    expect(await schema.isValid(null)).toEqual(true);
    expect(await schema.isValid("")).toEqual(true);
    expect(await schema.isValid(0)).toEqual(true);

    expect(await schema.isValid("string")).toEqual(false);
  });
  it("bool === boolean, null", async () => {
    const field = type.fields["bool"].resolve();

    const schema = getFieldYupType(field);

    expect(await schema.isValid(null)).toEqual(true);
    expect(await schema.isValid("")).toEqual(true);
    expect(await schema.isValid(true)).toEqual(true);
    expect(await schema.isValid(false)).toEqual(true);
    expect(await schema.isValid(0)).toEqual(true);

    expect(await schema.isValid(2)).toEqual(false);
    expect(await schema.isValid("string")).toEqual(false);
  });
  it("Enum === number, null", async () => {
    const field = type.fields["enum"].resolve();

    const schema = getFieldYupType(field);

    expect(await schema.isValid(null)).toEqual(true);
    expect(await schema.isValid("")).toEqual(true);
    expect(await schema.isValid(0)).toEqual(true);

    expect(await schema.isValid("string")).toEqual(false);
  });
  it("Message === object, null", async () => {
    const field = type.fields["any"].resolve();

    const schema = getFieldYupType(field);

    expect(await schema.isValid(null)).toEqual(true);
    expect(await schema.isValid("")).toEqual(true);
    expect(await schema.isValid({})).toEqual(true);
    expect(await schema.isValid('{"a": "aaaa"}')).toEqual(true);

    expect(await schema.isValid(100)).toEqual(false);
    expect(await schema.isValid("string")).toEqual(false);
  });
  it("Map === map, null", async () => {
    const field = type.fields["any"].resolve();

    const schema = getFieldYupType(field);

    expect(await schema.isValid(null)).toEqual(true);
    expect(await schema.isValid("")).toEqual(true);
    expect(await schema.isValid({})).toEqual(true);
    expect(await schema.isValid('{"a": "aaaa"}')).toEqual(true);

    expect(await schema.isValid(100)).toEqual(false);
    expect(await schema.isValid("string")).toEqual(false);
  });
  it("Array === object, null", async () => {
    const field = type.fields["repeatedString"].resolve();

    const schema = getFieldYupType(field);

    expect(await schema.isValid(null)).toEqual(true);
    expect(await schema.isValid("")).toEqual(true);
    expect(await schema.isValid([])).toEqual(true);
    expect(await schema.isValid('["a", "b"]')).toEqual(true);

    expect(await schema.isValid({})).toEqual(false);
    expect(await schema.isValid(100)).toEqual(false);
    expect(await schema.isValid("string")).toEqual(false);
  });
});
