import { context, type } from "../../tests/protobufjs-source";
import {
  exportedForTesting,
  getColorFromMethodType,
  getEnumsFromContext,
  getMethodType,
  getOptionsFromReflectionObject,
  getRequestType,
  getServicesFromContext,
  getTypesFromContext,
  RequestType,
  transformTypeValues,
} from "@/services/protobufjs";
import protobuf from "protobufjs";

const { isNamespaceBase, isType, isEnum, isService, traverseStructure } =
  exportedForTesting;

describe("protobufjs Service - getOptionsFromReflectionObject", () => {
  it("should return options from reflection object", () => {
    const field = type.fields["string"];
    const options = getOptionsFromReflectionObject(field);
    expect(options).toEqual({
      "(validate.rules).enum.defined_only": true,
      "(validate.rules).enum.not_in": 0,
      "(validate.rules).enum.in": "azuread",
    });
  });
  it("should return options from reflection object with parent", () => {
    const service = context.lookupService("helloworld.Greeter");
    const options = getOptionsFromReflectionObject(service, true);
    expect(options).toEqual({
      java_package: "com.example.tutorial",
    });
  });
  it("should not return options from reflection object without parent", () => {
    const service = context.lookupService("helloworld.Greeter");
    const options = getOptionsFromReflectionObject(service, false);
    expect(options).toEqual({});
  });
});

describe("protobufjs Service - getServicesFromContext", () => {
  it("should return services from context", () => {
    const services = getServicesFromContext(context);

    expect(services.length).not.toBe(0);
    expect(services[0].name).toEqual("Greeter");
  });
});

describe("protobufjs Service - getTypesFromContext", () => {
  it("should return types from context", () => {
    const types = getTypesFromContext(context);

    expect(types.length).not.toBe(0);
    expect(types[0].name).toEqual("HelloRequest");
  });
});

describe("protobufjs Service - getEnumsFromContext", () => {
  it("should return enums from context", () => {
    const enums = getEnumsFromContext(context);

    expect(enums.length).not.toBe(0);
    expect(enums[0].name).toEqual("Corpus");
  });
});

describe("protobufjs Service - isNamespaceBase", () => {
  it("should return true if current is NamespaceBase", () => {
    const result = isNamespaceBase(context);
    expect(result).toBe(true);
  });

  it("should return false if current is not NamespaceBase", () => {
    const field = type.fieldsArray[0];
    const result = isNamespaceBase(field);
    expect(result).toBe(false);
  });
});

describe("protobufjs Service - isType", () => {
  it("should return true if value is Type", () => {
    const result = isType(type);
    expect(result).toBe(true);
  });

  it("should return false if value is not Type", () => {
    const field = type.fieldsArray[0];
    const result = isType(field);
    expect(result).toBe(false);
  });
});

describe("protobufjs Service - isEnum", () => {
  it("should return true if value is Enum", () => {
    const enumType = getEnumsFromContext(context)[0];
    const result = isEnum(enumType);
    expect(result).toBe(true);
  });

  it("should return false if value is not Enum", () => {
    const field = type.fieldsArray[0];
    const result = isEnum(field);
    expect(result).toBe(false);
  });
});

describe("protobufjs Service - isService", () => {
  it("should return true if value is Service", () => {
    const service = getServicesFromContext(context)[0];
    const result = isService(service);
    expect(result).toBe(true);
  });

  it("should return false if value is not Service", () => {
    const field = type.fieldsArray[0];
    const result = isService(field);
    expect(result).toBe(false);
  });
});

describe("protobufjs Service - traverseStructure", () => {
  it("should traverse structure and call callback", () => {
    const callback = jest.fn();
    traverseStructure(context, isService, callback);
    expect(callback).toHaveBeenCalled();
  });

  it("should traverse structure and return services", () => {
    const services: protobuf.Service[] = [];
    traverseStructure(context, isService, (service) => {
      services.push(service);
    });
    expect(services.length).not.toBe(0);
    expect(services[0].name).toEqual("Greeter");
    expect(isService(services[0])).toEqual(true);
  });
});

describe("protobufjs Service - getRequestType", () => {
  it("should return request type - unary", () => {
    const service = context.lookupService("routeguide.RouteGuide");
    const method = service.methods["GetFeature"];
    method.resolve();

    const requestType = getRequestType(method);
    expect(requestType).toEqual(RequestType.UNARY);
  });
  it("should return request type - server streaming", () => {
    const service = context.lookupService("routeguide.RouteGuide");
    const method = service.methods["ListFeatures"];
    method.resolve();

    const requestType = getRequestType(method);
    expect(requestType).toEqual(RequestType.SERVER_STREAMING);
  });
  it("should return request type - client streaming", () => {
    const service = context.lookupService("routeguide.RouteGuide");
    const method = service.methods["RecordRoute"];
    method.resolve();

    const requestType = getRequestType(method);
    expect(requestType).toEqual(RequestType.CLIENT_STREAMING);
  });
  it("should return request type - bidirectional", () => {
    const service = context.lookupService("routeguide.RouteGuide");
    const method = service.methods["RouteChat"];
    method.resolve();

    const requestType = getRequestType(method);
    expect(requestType).toEqual(RequestType.BIDIRECTIONAL_STREAMING);
  });
});

describe("protobufjs Service - getColorFromMethodType", () => {
  it("should return danger color for bidirectional and client streaming", () => {
    const service = context.lookupService("routeguide.RouteGuide");
    const method = service.methods["RouteChat"];
    method.resolve();

    const color = getColorFromMethodType(method);
    expect(color).toEqual("danger");
  });

  it("should return dark color for server streaming", () => {
    const service = context.lookupService("routeguide.RouteGuide");
    const method = service.methods["ListFeatures"];
    method.resolve();

    const color = getColorFromMethodType(method);
    expect(color).toEqual("dark");
  });

  it("should return success color for unary", () => {
    const service = context.lookupService("routeguide.RouteGuide");
    const method = service.methods["GetFeature"];
    method.resolve();

    const color = getColorFromMethodType(method);
    expect(color).toEqual("success");
  });
});

describe("protobufjs Service - getMethodType", () => {
  it("should return Bi-directional streaming", () => {
    const service = context.lookupService("routeguide.RouteGuide");
    const method = service.methods["RouteChat"];
    method.resolve();

    const methodType = getMethodType(method);
    expect(methodType).toEqual("Bi-directional streaming");
  });

  it("should return Server streaming", () => {
    const service = context.lookupService("routeguide.RouteGuide");
    const method = service.methods["ListFeatures"];
    method.resolve();

    const methodType = getMethodType(method);
    expect(methodType).toEqual("Server streaming");
  });

  it("should return Client streaming", () => {
    const service = context.lookupService("routeguide.RouteGuide");
    const method = service.methods["RecordRoute"];
    method.resolve();

    const methodType = getMethodType(method);
    expect(methodType).toEqual("Client streaming");
  });

  it("should return Unary", () => {
    const service = context.lookupService("routeguide.RouteGuide");
    const method = service.methods["GetFeature"];
    method.resolve();

    const methodType = getMethodType(method);
    expect(methodType).toEqual("Unary");
  });
});

describe("protobufjs Service - transformTypeValues", () => {
  it("should return transformed values", () => {
    const transformValue = (value: protobuf.Field) => {
      return value.type;
    };
    const result = {
      any: "google.protobuf.Any",
      bool: "bool",
      bytes: "bytes",
      enum: "Corpus",
      enumAlias: "EnumAllowingAlias",
      map: "google.protobuf.Any",
      number: "int32",
      oneofNumber_1: "int32",
      oneofNumber_2: "int32",
      oneofString: "string",
      repeatedEnum: "Corpus",
      repeatedNumber: "int32",
      repeatedString: "string",
      string: "string",
    };
    const transformedValues = transformTypeValues(type, transformValue);
    expect(transformedValues).toEqual(result);
  });
  it("should return empty object if type is null", () => {
    const transformValue = (value: protobuf.Field) => {
      return value.type;
    };
    const transformedValues = transformTypeValues(null, transformValue);
    expect(transformedValues).toEqual({});
  });
});
