import "../../tests/mocks/grpc-web";
import {
  makeGrpcCall,
  makeGrpcServerStreamingCall,
} from "@/services/grpc-web-client";
import { context } from "../../tests/protobufjs-source";
import { GrpcWebFormat } from "@/types/grpc-web";
import {
  grpcWebMockHeaders,
  GrpcWebMockMetadataResultError,
  grpcWebMockResponseData,
  grpcWebMockTrailers,
} from "../../tests/mocks/grpc-web";

const hostname = "http://localhost:8080";
const service = context.lookupService("helloworld.Greeter");
const method = service.methods["SayHello"];
method.resolve();

const typeEncode = method.resolvedRequestType!;
const typeDecode = method.resolvedResponseType!;

const message = typeEncode.create({
  name: "world",
});

describe("grpc-web Service - makeGrpcCall", () => {
  it("should return a promise", () => {
    const result = makeGrpcCall(
      hostname,
      service,
      method,
      typeEncode,
      typeDecode,
      message,
    );

    expect(result).toBeInstanceOf(Promise);
  });
  it("should return a promise with data in TEXT mode", async () => {
    const result = await makeGrpcCall(
      hostname,
      service,
      method,
      typeEncode,
      typeDecode,
      message,
      {
        format: GrpcWebFormat.TEXT,
      },
    );

    expect(result.data).toEqual([grpcWebMockResponseData]);
    expect(result.headers).toEqual(grpcWebMockHeaders);
    expect(result.trailers).toEqual(grpcWebMockTrailers);
  });
  it("should return a promise with data in BINARY mode", async () => {
    const result = await makeGrpcCall(
      hostname,
      service,
      method,
      typeEncode,
      typeDecode,
      message,
      {
        format: GrpcWebFormat.BINARY,
      },
    );

    expect(result.data).toEqual([grpcWebMockResponseData]);
    expect(result.headers).toEqual(grpcWebMockHeaders);
    expect(result.trailers).toEqual(grpcWebMockTrailers);
  });
  it("should return a promise with error", async () => {
    const result = makeGrpcCall(
      hostname,
      service,
      method,
      typeEncode,
      typeDecode,
      message,
      {
        metadata: {
          expectedResult: GrpcWebMockMetadataResultError,
        },
      },
    );

    await expect(result).rejects.toThrow();
  });
});

describe("grpc-web Service - makeGrpcServerStreamingCall", () => {
  it("should return a data", () => {
    const stream = makeGrpcServerStreamingCall(
      hostname,
      service,
      method,
      typeEncode,
      typeDecode,
      message,
      {
        format: GrpcWebFormat.TEXT,
      },
    );

    stream.on("data", (data) => {
      expect(data).toEqual(grpcWebMockResponseData);
    });

    stream.on("metadata", (metadata) => {
      expect(metadata).toEqual(grpcWebMockHeaders);
    });

    stream.on("status", (status) => {
      expect(status.metadata).toEqual(grpcWebMockTrailers);
    });

    const resultFn = jest.fn();
    stream.on("end", resultFn);
    expect(resultFn).toHaveBeenCalled();
  });
  it("should return error", () => {
    const stream = makeGrpcServerStreamingCall(
      hostname,
      service,
      method,
      typeEncode,
      typeDecode,
      message,
      {
        metadata: {
          expectedResult: GrpcWebMockMetadataResultError,
        },
        format: GrpcWebFormat.TEXT,
      },
    );

    stream.on("metadata", (metadata) => {
      expect(metadata).toEqual(grpcWebMockHeaders);
    });

    stream.on("status", (status) => {
      expect(status.metadata).toEqual(grpcWebMockTrailers);
    });

    const errorFn = jest.fn();
    stream.on("error", errorFn);
    expect(errorFn).toHaveBeenCalled();

    const resultFn = jest.fn();
    stream.on("error", resultFn);
    expect(resultFn).toHaveBeenCalled();
  });
  it('should return an error when the format is not "TEXT"', () => {
    const fun = makeGrpcServerStreamingCall.bind(
      this,
      hostname,
      service,
      method,
      typeEncode,
      typeDecode,
      message,
      {
        format: GrpcWebFormat.BINARY,
      },
    );

    expect(fun).toThrow();
  });
});
