import protobuf from "protobufjs";
import * as yup from "yup";

export function getFieldYupType(field: protobuf.Field) {
  if (field.map) {
    return yup
      .object()
      .transform((val, orig) => (orig == "" ? null : val))
      .nullable()
      .json();
  }

  if (field.repeated) {
    return yup
      .array()
      .transform((val, orig) => (orig == "" ? null : val))
      .nullable()
      .json();
  }

  if (field.resolvedType == null) {
    if (typeof field.typeDefault === "boolean") {
      return yup
        .boolean()
        .transform((val, orig) => (orig == "" ? null : val))
        .nullable();
    }

    if (typeof field.typeDefault === "number") {
      return yup
        .number()
        .transform((val, orig) => (orig == "" ? null : val))
        .nullable();
    }

    if (field.type === "bytes") {
      return yup.mixed<File>().nullable();
    }

    return yup.string().nullable();
  }

  if (field.resolvedType instanceof protobuf.Enum) {
    return yup.string().nullable();
  }

  return yup
    .object()
    .transform((val, orig) => (orig == "" ? null : val))
    .nullable()
    .json();
}
