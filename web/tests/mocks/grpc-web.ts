import { RpcError, StatusCode } from "grpc-web";

export const GrpcWebMockMetadataResultError = "error";
export const grpcWebMockHeaders = { header: "header" };
export const grpcWebMockResponseData = { message: "Hello world!" };
export const grpcWebMockTrailers = { trailer: "trailer" };

jest.mock("grpc-web", () => {
  return {
    ...jest.requireActual("grpc-web"),
    GrpcWebClientBase: jest.fn().mockImplementation(() => {
      return {
        rpcCall: (
          _method: string,
          _request: unknown,
          metadata: { expectedResult?: typeof GrpcWebMockMetadataResultError },
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
                callback(grpcWebMockHeaders);
              }
              if (eventType === "status") {
                callback({ metadata: grpcWebMockTrailers });
              }

              if (metadata.expectedResult === GrpcWebMockMetadataResultError) {
                fnCallback(
                  new RpcError(StatusCode.UNKNOWN, "response is error", {}),
                  undefined,
                );
              } else {
                if (eventType === "data") {
                  callback(grpcWebMockResponseData);
                }
                fnCallback(undefined, grpcWebMockResponseData);
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
          metadata: { expectedResult?: typeof GrpcWebMockMetadataResultError },
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
                callback(grpcWebMockHeaders);
              }
              if (eventType === "status") {
                callback({ metadata: grpcWebMockTrailers });
              }

              if (metadata.expectedResult === GrpcWebMockMetadataResultError) {
                if (eventType === "error") {
                  callback(
                    new RpcError(StatusCode.UNKNOWN, "response is error", {}),
                  );
                }
              } else {
                if (eventType === "data") {
                  callback(grpcWebMockResponseData);
                  callback(grpcWebMockResponseData);
                  callback(grpcWebMockResponseData);
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
