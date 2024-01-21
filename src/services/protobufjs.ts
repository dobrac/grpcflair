import protobuf, { MapField } from "protobufjs";

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

export function getFieldDefaultValue(field: protobuf.Field) {
  if (field.resolvedType == null) {
    if (field.repeated) {
      // For empty strings, return type name
      if (field.typeDefault === "") {
        return field.type;
      }

      return field.typeDefault ?? field.type;
    } else {
      return field.defaultValue ?? field.typeDefault ?? field.type;
    }
  }

  if (field.resolvedType instanceof protobuf.Enum) {
    return field.resolvedType.values[0];
  }

  return getTypeDefaultValues(field.resolvedType);
}

export function getTypeDefaultValues(
  type: protobuf.Type | null,
  ignorePrimitives = false,
) {
  const result: any = {};
  if (type == null) {
    return result;
  }

  const fieldsWithoutPartOf = type.fieldsArray.filter((field) => !field.partOf);

  for (const field of fieldsWithoutPartOf) {
    field.resolve();
    const fieldName = field.name;

    // Ignore primitives if specified as all fields are optional by default
    const primitiveOrEnum =
      field.resolvedType == null || field.resolvedType instanceof protobuf.Enum;
    if (ignorePrimitives && field.optional && primitiveOrEnum) {
      continue;
    }

    const value = getFieldDefaultValue(field);
    if (field.repeated) {
      result[fieldName] = [value];
    } else if (field.map) {
      const fieldMap = field as unknown as MapField;
      const fieldMapKeyValue = fieldMap.keyType;
      result[fieldName] = {
        [fieldMapKeyValue]: value,
      };
    } else {
      result[fieldName] = value;
    }
  }
  return result;
}

export enum RequestType {
  UNARY,
  CLIENT_STREAMING,
  SERVER_STREAMING,
  BIDIRECTIONAL_STREAMING,
}

export function getRequestType(method: protobuf.Method): RequestType {
  if (method.requestStream && method.responseStream) {
    return RequestType.BIDIRECTIONAL_STREAMING;
  } else if (method.requestStream) {
    return RequestType.CLIENT_STREAMING;
  } else if (method.responseStream) {
    return RequestType.SERVER_STREAMING;
  } else {
    return RequestType.UNARY;
  }
}

export function getColorFromMethodType(method: protobuf.Method): string {
  switch (getRequestType(method)) {
    case RequestType.BIDIRECTIONAL_STREAMING:
    case RequestType.CLIENT_STREAMING:
      return "danger";
    case RequestType.SERVER_STREAMING:
      return "dark";
    case RequestType.UNARY:
      return "success";
  }
}

export function getMethodType(method: protobuf.Method) {
  switch (getRequestType(method)) {
    case RequestType.BIDIRECTIONAL_STREAMING:
      return "Bi-directional streaming";
    case RequestType.CLIENT_STREAMING:
      return "Client streaming";
    case RequestType.SERVER_STREAMING:
      return "Server streaming";
    case RequestType.UNARY:
      return "Unary";
  }
}
