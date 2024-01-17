import protobuf from "protobufjs";

export function getServicesFromContext(
  context: protobuf.Root,
): protobuf.Service[] {
  const values: protobuf.Service[] = [];
  traverseStructure(context, isService, (type) => {
    values.push(type);
  });
  return values;
}

export function getTypesFromContext(context: protobuf.Root): protobuf.Type[] {
  const values: protobuf.Type[] = [];
  traverseStructure(context, isType, (type) => {
    values.push(type);
  });
  return values;
}

export function getEnumsFromContext(context: protobuf.Root): protobuf.Enum[] {
  const values: protobuf.Enum[] = [];
  traverseStructure(context, isEnum, (type) => {
    values.push(type);
  });
  return values;
}

function isNamespaceBase(
  current: protobuf.NamespaceBase | protobuf.ReflectionObject,
): current is protobuf.NamespaceBase {
  return (current as protobuf.NamespaceBase).nestedArray !== undefined;
}

type ProtobufJsType =
  | protobuf.Type
  | protobuf.Enum
  | protobuf.Service
  | protobuf.NamespaceBase
  | protobuf.ReflectionObject;

function isType(value: ProtobufJsType): value is protobuf.Type {
  return value instanceof protobuf.Type;
}

function isEnum(value: ProtobufJsType): value is protobuf.Enum {
  return value instanceof protobuf.Enum;
}

function isService(value: ProtobufJsType): value is protobuf.Service {
  return value instanceof protobuf.Service;
}

// Source: https://github.com/protobufjs/protobuf.js/blob/master/examples/traverse-types.js
function traverseStructure<DesiredType extends ProtobufJsType>(
  current: ProtobufJsType,
  typeCheckFn: (value: ProtobufJsType) => value is DesiredType,
  fn: (type: DesiredType) => void,
) {
  if (typeCheckFn(current)) {
    // and/or protobuf.Enum, protobuf.Service etc.
    fn(current);
  }
  if (isNamespaceBase(current)) {
    current.nestedArray.forEach(function (nested) {
      traverseStructure(nested, typeCheckFn, fn);
    });
  }
}

export function serializeFieldDefaultValuesToJSON(
  fields: Record<string, protobuf.Field>,
) {
  const result: any = {};
  for (const [fieldName, field] of Object.entries(fields)) {
    field.resolve();
    if (field.resolvedType != null) {
      if (field.resolvedType instanceof protobuf.Enum) {
        result[fieldName] = field.resolvedType.values[0];
      } else {
        result[fieldName] = serializeFieldDefaultValuesToJSON(
          field.resolvedType.fields,
        );
      }
    } else {
      result[fieldName] = field.defaultValue ?? field.typeDefault ?? field.type;
    }
  }
  return result;
}