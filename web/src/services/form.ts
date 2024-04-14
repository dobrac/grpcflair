import protobuf, { MapField } from "protobufjs";
import { transformTypeValues } from "@/services/protobufjs";

/**
 * MAX_DEPTH is the maximum depth to traverse the protobuf message to generate
 */
const MAX_DEPTH = 1;

/**
 * getFieldPlaceholderValue returns a placeholder value for a field.
 * If the field is a message, it will return a placeholder object.
 * If the field is an enum, it will return the first enum value.
 * If the field is a scalar, it will return the default value or the type.
 * @param depth the depth of the field
 * @param field the protobuf field
 * @returns a placeholder value
 */
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

/**
 * placeholderTransformationWithDepth returns a placeholder transformation for a field.
 * If the field is repeated, it will return an array with a placeholder value.
 * If the field is a map, it will return an object with a placeholder key and value.
 * If the field is a scalar, it will return a placeholder value.
 * @param depth the depth of the field
 * @param field the protobuf field
 * @returns a placeholder transformation
 */
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

/**
 * placeholderTransformation returns a placeholder transformation for a field.
 * If the field is repeated, it will return an array with a placeholder value.
 * If the field is a map, it will return an object with a placeholder key and value.
 * If the field is a scalar, it will return a placeholder value.
 * @param field the protobuf field
 * @returns a placeholder transformation
 */
export function placeholderTransformation(field: protobuf.Field) {
  return placeholderTransformationWithDepth(0, field);
}

/**
 * formTransformation returns a JSON string of the placeholder transformation for a field.
 * If the field is repeated or a map, it will return an empty string.
 * If the field is an enum, it will return an empty string.
 * If the field is a message, it will return a JSON string of the placeholder transformation.
 * @param field the protobuf field
 * @returns a JSON string of the placeholder transformation
 */
export function formTransformation(field: protobuf.Field): string {
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

export const exportedForTesting = {
  getFieldPlaceholderValue,
  placeholderTransformationWithDepth,
};
