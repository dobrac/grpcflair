import protobuf from "protobufjs";
import * as yup from "yup";

/**
 * Returns the yup type for a field.
 * @param field the field to get the yup type for
 * @returns the yup type for the field
 */
export function getFieldYupType(field: protobuf.Field): yup.Schema {
  if (field.map) {
    return yup
      .object()
      .typeError(`Field "${field.name}" must be an object`)
      .transform((val, orig) => (orig == "" ? null : val))
      .nullable()
      .json();
  }

  if (field.repeated) {
    return yup
      .array()
      .typeError(`Field "${field.name}" must be an array object`)
      .transform((val, orig) => (orig == "" ? null : val))
      .nullable()
      .json();
  }

  if (field.resolvedType == null) {
    if (typeof field.typeDefault === "boolean") {
      return yup
        .boolean()
        .typeError(`Field "${field.name}" must be a boolean`)
        .transform((val, orig) => (orig == "" ? null : val))
        .nullable();
    }

    if (typeof field.typeDefault === "number") {
      return yup
        .number()
        .typeError(`Field "${field.name}" must be a number`)
        .transform((val, orig) => (orig == "" ? null : val))
        .nullable();
    }

    if (field.type === "bytes") {
      return yup.mixed<Uint8Array>().nullable();
    }

    return yup.string().nullable();
  }

  if (field.resolvedType instanceof protobuf.Enum) {
    return yup
      .number()
      .transform((val, orig) => (orig == "" ? null : val))
      .nullable();
  }

  return yup
    .object()
    .transform((val, orig) => (orig == "" ? null : val))
    .typeError(`Field "${field.name}" must be an object`)
    .nullable()
    .json();
}
