import protobuf from "protobufjs";

/**
 * Returns the options from a reflection object.
 * @param reflectionObject the reflection object to get the options from
 * @param includeParent whether to include the parent's options
 * @returns the options from the reflection object
 */
export function getOptionsFromReflectionObject(
  reflectionObject: protobuf.ReflectionObject,
  includeParent = true,
): Record<string, unknown> {
  return {
    ...reflectionObject.options,
    ...(includeParent ? reflectionObject.parent?.options : {}),
  };
}

/**
 * Returns the services from a context.
 * @param context the context to get the services from
 * @returns the services from the context
 */
export function getServicesFromContext(
  context: protobuf.Root,
): protobuf.Service[] {
  const values: protobuf.Service[] = [];
  traverseStructure(context, isService, (type) => {
    values.push(type);
  });
  return values;
}

/**
 * Returns the types from a context.
 * @param context the context to get the types from
 * @returns the types from the context
 */
export function getTypesFromContext(context: protobuf.Root): protobuf.Type[] {
  const values: protobuf.Type[] = [];
  traverseStructure(context, isType, (type) => {
    values.push(type);
  });
  return values;
}

/**
 * Returns the enums from a context.
 * @param context the context to get the enums from
 * @returns the enums from the context
 */
export function getEnumsFromContext(context: protobuf.Root): protobuf.Enum[] {
  const values: protobuf.Enum[] = [];
  traverseStructure(context, isEnum, (type) => {
    values.push(type);
  });
  return values;
}

/**
 * Checks if a reflection object is a NamespaceBase type
 * @param current the reflection object to check
 * @returns true if the reflection object is a NamespaceBase, false otherwise
 */
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

/**
 * Checks if a value is a protobuf.Type for TypeScript type guards
 * @param value the value to check
 */
function isType(value: ProtobufJsType): value is protobuf.Type {
  return value instanceof protobuf.Type;
}

/**
 * Checks if a value is a protobuf.Enum for TypeScript type guards
 * @param value the value to check
 */
function isEnum(value: ProtobufJsType): value is protobuf.Enum {
  return value instanceof protobuf.Enum;
}

/**
 * Checks if a value is a protobuf.Service for TypeScript type guards
 * @param value the value to check
 */
function isService(value: ProtobufJsType): value is protobuf.Service {
  return value instanceof protobuf.Service;
}

/**
 * Traverses a structure and calls a function on each type that matches the typeCheckFn
 *
 * Source: https://github.com/protobufjs/protobuf.js/blob/master/examples/traverse-types.js
 *
 * @param current the current type to traverse
 * @param typeCheckFn the function to check if the type matches
 * @param fn the function to call on the type
 */
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

export enum RequestType {
  UNARY,
  CLIENT_STREAMING,
  SERVER_STREAMING,
  BIDIRECTIONAL_STREAMING,
}

/**
 * Get the request type of method
 * @param method the method to get the request type from
 * @returns the request type of the method
 */
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

/**
 * Get the color of a method based on its type
 * @param method the method to get the color from
 * @returns the color of the method
 */
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

/**
 * Get the display name of a request type
 * @param type the request type to get the display name from
 * @returns the display name of the request type
 */
export function getRequestTypeDisplayName(type: RequestType) {
  switch (type) {
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

/**
 * Get the display name of a method type
 * @param method the method to get the display name from
 * @returns the display name of the method type
 */
export function getMethodTypeDisplayName(method: protobuf.Method) {
  return getRequestTypeDisplayName(getRequestType(method));
}

/**
 * Transform the values of an object using a function
 * @param type the type object to transform
 * @param transformValue the function to transform the values
 * @returns the transformed object
 */
export function transformTypeValues(
  type: protobuf.Type | null,
  transformValue: (value: protobuf.Field) => unknown,
) {
  const result: any = {};
  if (type == null) {
    return result;
  }

  for (const field of type.fieldsArray) {
    field.resolve();
    const fieldName = field.name;

    result[fieldName] = transformValue(field);
  }
  return result;
}

export const exportedForTesting = {
  isNamespaceBase,
  isType,
  isEnum,
  isService,
  traverseStructure,
};
