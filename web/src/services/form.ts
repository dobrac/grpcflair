import protobuf, { MapField } from "protobufjs";
import { transformTypeValues } from "@/services/protobufjs";

const MAX_DEPTH = 1;

function getFieldPlaceholderValue(
  depth: number,
  field: protobuf.Field,
): unknown {
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

  if (depth >= MAX_DEPTH) {
    return {};
  }

  return transformTypeValues(
    field.resolvedType,
    placeholderTransformationWithDepth.bind(null, depth + 1),
  );
}

function placeholderTransformationWithDepth(
  depth: number,
  field: protobuf.Field,
) {
  if (field.repeated) {
    return [getFieldPlaceholderValue(depth, field)];
  }

  if (field.map) {
    const fieldMap = field as unknown as MapField;
    const fieldMapKeyValue = fieldMap.keyType;
    const value = getFieldPlaceholderValue(depth, field);
    return {
      [fieldMapKeyValue]: value,
    };
  }

  return getFieldPlaceholderValue(depth, field);
}

export function placeholderTransformation(field: protobuf.Field) {
  return placeholderTransformationWithDepth(0, field);
}

export function formTransformation(field: protobuf.Field) {
  if (field.repeated || field.map) {
    return "";
  }

  if (field.resolvedType == null) {
    return "";
  }

  if (field.resolvedType instanceof protobuf.Enum) {
    return "";
  }

  return JSON.stringify(
    transformTypeValues(field.resolvedType, placeholderTransformation),
    null,
    2,
  );
}
