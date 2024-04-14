import protobuf from "protobufjs";
import {
  ClientReadableStream,
  GrpcWebClientBase,
  Metadata,
  MethodDescriptor,
  MethodType,
} from "grpc-web";
import { GrpcWebFormat } from "@/types/grpc-web";

/**
 * Dummy class to be used in the MethodDescriptor.
 */
class DummyRPCType {
  constructor(...args: unknown[]) {}
}

/**
 * Options for a gRPC call.
 */
export interface GrpcWebOptions {
  metadata?: Metadata;
  format?: GrpcWebFormat;
}

/**
 * The response of a unary gRPC call.
 */
export interface UnaryResponse<MessageData extends object = object> {
  headers?: Metadata;
  trailers?: Metadata;
  data?: protobuf.Message<MessageData>[];
}

/**
 * makeGrpcCall makes a unary gRPC call to the given service and method.
 * @param hostname The hostname of the gRPC server.
 * @param service The protobuf service.
 * @param method The protobuf method.
 * @param typeEncode The protobuf type to encode the message.
 * @param typeDecode The protobuf type to decode the response.
 * @param message The message to send.
 * @param options The request options.
 */
export function makeGrpcCall<MessageData extends object = object>(
  hostname: string,
  service: protobuf.Service,
  method: protobuf.Method,
  typeEncode: protobuf.Type,
  typeDecode: protobuf.Type,
  message: protobuf.Message,
  options?: GrpcWebOptions,
): Promise<UnaryResponse<MessageData>> {
  const client = new GrpcWebClientBase({ format: options?.format });

  const methodPath = `${hostname}/${
    // Replace starting dot "."
    service.fullName.replace(".", "")
  }/${method.name}`;

  return new Promise((resolve, reject) => {
    let completeResponse: UnaryResponse<MessageData> = {};

    const unaryStream = client.rpcCall(
      methodPath,
      // Ignored, using protobufjs directly
      {},
      options?.metadata ?? {},
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
          completeResponse.data = [response];
        }
      },
    );

    unaryStream.on("metadata", (metadata) => {
      completeResponse.headers = metadata;
    });

    unaryStream.on("status", (status) => {
      completeResponse.trailers = status.metadata;
    });

    unaryStream.on("end", () => {
      resolve(completeResponse);
    });
  });
}

/**
 * makeGrpcServerStreamingCall makes a server streaming gRPC call to the given service and method.
 * @param hostname The hostname of the gRPC server.
 * @param service The protobuf service.
 * @param method The protobuf method.
 * @param typeEncode The protobuf type to encode the message.
 * @param typeDecode The protobuf type to decode the response.
 * @param message The message to send.
 * @param options The request options.
 */
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
    options?.metadata ?? {},
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
