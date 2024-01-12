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
