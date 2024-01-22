import protobuf from "protobufjs";
import {
  ClientReadableStream,
  GrpcWebClientBase,
  MethodDescriptor,
  MethodType,
} from "grpc-web";
import { GrpcWebFormat } from "@/types/grpc-web";

class DummyRPCType {
  constructor(...args: unknown[]) {}
}

export interface GrpcWebOptions {
  format?: GrpcWebFormat;
}

export function makeGrpcCall<MessageData extends object = object>(
  hostname: string,
  service: protobuf.Service,
  method: protobuf.Method,
  typeEncode: protobuf.Type,
  typeDecode: protobuf.Type,
  message: protobuf.Message,
  options?: GrpcWebOptions,
): Promise<protobuf.Message<MessageData>> {
  const client = new GrpcWebClientBase({ format: options?.format });

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
      },
    );
  });
}

export function makeGrpcServerStreamingCall<
  MessageData extends object = object,
>(
  hostname: string,
  service: protobuf.Service,
  method: protobuf.Method,
  typeEncode: protobuf.Type,
  typeDecode: protobuf.Type,
  message: protobuf.Message,
  options?: GrpcWebOptions,
): ClientReadableStream<protobuf.Message<MessageData>> {
  if (options?.format !== GrpcWebFormat.TEXT) {
    throw new Error(
      `Only format ${GrpcWebFormat.TEXT} is supported for grpc-web server streaming`,
    );
  }

  const client = new GrpcWebClientBase({ format: options?.format });

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
