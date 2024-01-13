import protobuf from "protobufjs";
import {
  ClientReadableStream,
  GrpcWebClientBase,
  MethodDescriptor,
  MethodType,
} from "grpc-web";

class DummyRPCType {
  constructor(...args: unknown[]) {}
}

export function makeGrpcCall<MessageData extends object = object>(
  service: protobuf.Service,
  method: protobuf.Method,
  typeEncode: protobuf.Type,
  typeDecode: protobuf.Type,
  message: protobuf.Message,
  callback?: (
    err: Error | null,
    response: protobuf.Message<MessageData>,
  ) => void,
): Promise<protobuf.Message<MessageData>> {
  const hostname = "http://localhost:8080";
  const client = new GrpcWebClientBase({ format: "text" });

  const methodPath = `${hostname}/${
    // Replace starting dot "."
    service.fullName.replace(".", "")
  }/${method.name}`;

  return new Promise((resolve, reject) => {
    client.rpcCall(
      methodPath,
      // Ignored, using protobufjs directly
      {},
      {},
      new MethodDescriptor(
        method.name,
        MethodType.UNARY,
        // Ignored, using protobufjs directly
        DummyRPCType,
        // Ignored, using protobufjs directly
        DummyRPCType,
        () => {
          return typeEncode.encode(message).finish();
        },
        (bytes: Uint8Array) => {
          return typeDecode.decode(bytes);
        },
      ),
      (err, response: protobuf.Message<MessageData>) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
        callback?.(err, response);
      },
    );
  });
}

export function makeGrpcServerStreamingCall<
  MessageData extends object = object,
>(
  service: protobuf.Service,
  method: protobuf.Method,
  typeEncode: protobuf.Type,
  typeDecode: protobuf.Type,
  message: protobuf.Message,
): ClientReadableStream<protobuf.Message<MessageData>> {
  const hostname = "http://localhost:8080";
  const client = new GrpcWebClientBase({ format: "text" });

  const methodPath = `${hostname}/${
    // Replace starting dot "."
    service.fullName.replace(".", "")
  }/${method.name}`;

  return client.serverStreaming<{}, protobuf.Message<MessageData>>(
    methodPath,
    // Ignored, using protobufjs directly
    {},
    {},
    new MethodDescriptor(
      method.name,
      MethodType.SERVER_STREAMING,
      // Ignored, using protobufjs directly
      DummyRPCType,
      // Ignored, using protobufjs directly
      DummyRPCType,
      () => {
        return typeEncode.encode(message).finish();
      },
      (bytes: Uint8Array) => {
        return typeDecode.decode(bytes);
      },
    ),
  );
}
