import protobuf, { MapField } from "protobufjs";
import { transformTypeValues } from "@/services/protobufjs";

function getFieldPlaceholderValue(field: protobuf.Field): unknown {
  if (field.resolvedType == null) {
    const value = field.typeDefault ?? field.type;

    // For empty strings, return type name
    if (value === "") {
      return field.type;
    }

    return value;
  }

  if (field.resolvedType instanceof protobuf.Enum) {
    return Object.values(field.resolvedType.values)[0];
  }

  return transformTypeValues(field.resolvedType, placeholderTransformation);
}

export function placeholderTransformation(field: protobuf.Field) {
  if (field.repeated) {
    return [getFieldPlaceholderValue(field)];
  }

  if (field.map) {
    const fieldMap = field as unknown as MapField;
    const fieldMapKeyValue = fieldMap.keyType;
    const value = getFieldPlaceholderValue(field);
    return {
      [fieldMapKeyValue]: value,
    };
  }

  return getFieldPlaceholderValue(field);
}

function getFieldFormValue(field: protobuf.Field): string {
  if (field.resolvedType == null) {
    return "";
  }

  if (field.resolvedType instanceof protobuf.Enum) {
    return "";
  }

  return JSON.stringify(
    transformTypeValues(field.resolvedType, formTransformation),
    null,
    2,
  );
}

export function formTransformation(field: protobuf.Field) {
  if (field.repeated) {
    return "";
  }

  if (field.map) {
    const fieldMap = field as unknown as MapField;
    const fieldMapKeyValue = fieldMap.keyType;
    const value = getFieldFormValue(field);
    return JSON.stringify(
      {
        [fieldMapKeyValue]: value ? JSON.parse(value) : null,
      },
      null,
      2,
    );
  }

  return getFieldFormValue(field);
}
