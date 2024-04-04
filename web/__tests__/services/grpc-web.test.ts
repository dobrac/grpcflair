import { makeGrpcCall, makeGrpcServerStreamingCall } from "@/services/grpc-web";
import { context } from "../../tests/protobufjs-source";
import { RpcError, StatusCode } from "grpc-web";
import { GrpcWebFormat } from "@/types/grpc-web";

const headers = { header: "header" };
const responseData = { message: "Hello world!" };
const trailers = { trailer: "trailer" };

const MetadataResultError = "error";

jest.mock("grpc-web", () => {
  return {
    ...jest.requireActual("grpc-web"),
    GrpcWebClientBase: jest.fn().mockImplementation(() => {
      return {
        rpcCall: (
          _method: string,
          _request: unknown,
          metadata: { expectedResult?: typeof MetadataResultError },
          methodDescriptor: {
            a: () => Uint8Array;
            b: (bytes: Uint8Array) => unknown;
          },
          fnCallback: (err: RpcError | undefined, response: unknown) => void,
        ) => {
          // Request serialize function
          methodDescriptor.a();

          // Response deserialize function
          methodDescriptor.b(new Uint8Array());

          return {
            on: (eventType: string, callback: (value?: unknown) => void) => {
              if (eventType === "metadata") {
                callback(headers);
              }
              if (eventType === "status") {
                callback({ metadata: trailers });
              }

              if (metadata.expectedResult === MetadataResultError) {
                fnCallback(
                  new RpcError(StatusCode.UNKNOWN, "response is error", {}),
                  undefined,
                );
              } else {
                if (eventType === "data") {
                  callback(responseData);
                }
                fnCallback(undefined, responseData);
              }

              if (eventType === "end") {
                callback();
              }
            },
          };
        },
        serverStreaming: (
          _method: string,
          _request: unknown,
          metadata: { expectedResult?: typeof MetadataResultError },
          methodDescriptor: {
            a: () => Uint8Array;
            b: (bytes: Uint8Array) => unknown;
          },
        ) => {
          // Request serialize function
          methodDescriptor.a();

          // Response deserialize function
          methodDescriptor.b(new Uint8Array());

          return {
            on: (eventType: string, callback: (value?: unknown) => void) => {
              if (eventType === "metadata") {
                callback(headers);
              }
              if (eventType === "status") {
                callback({ metadata: trailers });
              }

              if (metadata.expectedResult === MetadataResultError) {
                if (eventType === "error") {
                  callback(
                    new RpcError(StatusCode.UNKNOWN, "response is error", {}),
                  );
                }
              } else {
                if (eventType === "data") {
                  callback(responseData);
                }
              }

              if (eventType === "end") {
                callback();
              }
            },
          };
        },
      };
    }),
  };
});

describe("grpc-web Service - makeGrpcCall", () => {
  const hostname = "http://localhost:8080";
  const service = context.lookupService("helloworld.Greeter");
  const method = service.methods["SayHello"];
  method.resolve();

  const typeEncode = method.resolvedRequestType!;
  const typeDecode = method.resolvedResponseType!;

  const message = typeEncode.create({
    name: "world",
  });

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

    expect(result.data).toEqual([responseData]);
    expect(result.headers).toEqual(headers);
    expect(result.trailers).toEqual(trailers);
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

    expect(result.data).toEqual([responseData]);
    expect(result.headers).toEqual(headers);
    expect(result.trailers).toEqual(trailers);
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
          expectedResult: MetadataResultError,
        },
      },
    );

    await expect(result).rejects.toThrow();
  });
});

describe("grpc-web Service - makeGrpcServerStreamingCall", () => {
  const hostname = "http://localhost:8080";
  const service = context.lookupService("helloworld.Greeter");
  const method = service.methods["SayHello"];
  method.resolve();

  const typeEncode = method.resolvedRequestType!;
  const typeDecode = method.resolvedResponseType!;

  const message = typeEncode.create({
    name: "world",
  });

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
      expect(data).toEqual(responseData);
    });

    stream.on("metadata", (metadata) => {
      expect(metadata).toEqual(headers);
    });

    stream.on("status", (status) => {
      expect(status.metadata).toEqual(trailers);
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
          expectedResult: MetadataResultError,
        },
        format: GrpcWebFormat.TEXT,
      },
    );

    stream.on("metadata", (metadata) => {
      expect(metadata).toEqual(headers);
    });

    stream.on("status", (status) => {
      expect(status.metadata).toEqual(trailers);
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
