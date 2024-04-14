import "../../../tests/mocks/grpc-web";
import { GrpcWebFormat } from "@/types/grpc-web";
import { context } from "../../../tests/protobufjs-source";
import { grpcWebBackend } from "@/services/backends/grpc-web";
import { RequestType } from "@/services/protobufjs";
import {
  grpcWebMockHeaders,
  GrpcWebMockMetadataResultError,
  grpcWebMockResponseData,
  grpcWebMockTrailers,
} from "../../../tests/mocks/grpc-web";
import { MethodFunctions } from "@/contexts/MethodContext";

const hostname = "http://localhost:8080";
const service = context.lookupService("helloworld.Greeter");
const method = service.methods["SayHello"];
method.resolve();
const typeEncode = method.resolvedRequestType!;
const typeDecode = method.resolvedResponseType!;

const message = typeEncode.create({
  name: "world",
});

describe("grpc-web backend - UNARY", () => {
  const backendFn = grpcWebBackend[RequestType.UNARY];

  const functions: Partial<MethodFunctions> = {
    setResponse: jest.fn((resp) => typeof resp === "function" && resp({})),
    setCancelFunction: jest.fn(),
  };
  const metadata = {};

  it("should return a promise", async () => {
    const options = {};
    const result = backendFn?.(
      hostname,
      service,
      method,
      typeEncode,
      typeDecode,
      message,
      metadata,
      functions,
      options,
    );
    expect(result).toBeInstanceOf(Promise);
  });
  it("should return a promise with data in TEXT mode", async () => {
    if (!backendFn) {
      throw new Error("Method not implemented");
    }

    await backendFn(
      hostname,
      service,
      method,
      typeEncode,
      typeDecode,
      message,
      metadata,
      functions,
      {
        format: GrpcWebFormat.TEXT,
      },
    );

    expect(functions.setCancelFunction).toHaveBeenCalled();

    expect(functions.setResponse).toHaveBeenCalled();
    expect(functions.setResponse).toHaveLastReturnedWith({
      headers: grpcWebMockHeaders,
      trailers: grpcWebMockTrailers,
      data: [grpcWebMockResponseData],
    });
  });
  it("should return a promise with data in BINARY mode", async () => {
    if (!backendFn) {
      throw new Error("Method not implemented");
    }

    await backendFn(
      hostname,
      service,
      method,
      typeEncode,
      typeDecode,
      message,
      metadata,
      functions,
      {
        format: GrpcWebFormat.BINARY,
      },
    );

    expect(functions.setCancelFunction).toHaveBeenCalled();

    expect(functions.setResponse).toHaveBeenCalled();
    expect(functions.setResponse).toHaveLastReturnedWith({
      headers: grpcWebMockHeaders,
      trailers: grpcWebMockTrailers,
      data: [grpcWebMockResponseData],
    });
  });
  it("should return a promise with error", async () => {
    if (!backendFn) {
      throw new Error("Method not implemented");
    }

    const metadata = {
      expectedResult: GrpcWebMockMetadataResultError,
    };
    const result = backendFn(
      hostname,
      service,
      method,
      typeEncode,
      typeDecode,
      message,
      metadata,
      functions,
      {},
    );

    await expect(result).rejects.toThrow();
  });
});

describe("grpc-web backend - server streaming", () => {
  const backendFn = grpcWebBackend[RequestType.SERVER_STREAMING];

  let returnedData = {};
  const functions: Partial<MethodFunctions> = {
    setResponse: jest.fn((resp) => {
      if (!(typeof resp === "function")) {
        return;
      }
      returnedData = resp(returnedData) ?? {};
      return returnedData;
    }),
    setCancelFunction: jest.fn(),
  };
  const metadata = {};

  it("should return a data", async () => {
    if (!backendFn) {
      throw new Error("Method not implemented");
    }
    await backendFn(
      hostname,
      service,
      method,
      typeEncode,
      typeDecode,
      message,
      metadata,
      functions,
      {
        format: GrpcWebFormat.TEXT,
      },
    );

    expect(functions.setCancelFunction).toHaveBeenCalled();

    expect(functions.setResponse).toHaveBeenCalled();
    expect(functions.setResponse).toHaveLastReturnedWith({
      headers: grpcWebMockHeaders,
      trailers: grpcWebMockTrailers,
      data: [
        grpcWebMockResponseData,
        grpcWebMockResponseData,
        grpcWebMockResponseData,
      ],
    });
  });
  it("should return error", async () => {
    if (!backendFn) {
      throw new Error("Method not implemented");
    }
    const promise = backendFn(
      hostname,
      service,
      method,
      typeEncode,
      typeDecode,
      message,
      {
        expectedResult: GrpcWebMockMetadataResultError,
      },
      functions,
      {
        format: GrpcWebFormat.TEXT,
      },
    );

    await expect(promise).rejects.toThrow();
  });
  it('should return an error when the format is not "TEXT"', async () => {
    if (!backendFn) {
      throw new Error("Method not implemented");
    }
    const promise = backendFn(
      hostname,
      service,
      method,
      typeEncode,
      typeDecode,
      message,
      {
        expectedResult: GrpcWebMockMetadataResultError,
      },
      functions,
      {
        format: GrpcWebFormat.BINARY,
      },
    );

    await expect(promise).rejects.toThrow();
  });
});
