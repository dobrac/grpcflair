import protobuf from "protobufjs";
import { MethodFunctions } from "@/contexts/MethodContext";
import { GrpcWebFormat } from "@/types/grpc-web";
import { RequestType } from "@/services/protobufjs";
import { grpcWebBackend } from "@/services/backends/grpc-web";

/**
 * HandleRequest is a function that handles a request to a gRPC service.
 */
export type HandleRequest = (
  hostname: string,
  service: protobuf.Service,
  method: protobuf.Method,
  requestType: protobuf.Type,
  responseType: protobuf.Type,
  message: protobuf.Message<{}>,
  metadata: Record<string, string>,
  functions: Partial<MethodFunctions>,
  options?: { format?: GrpcWebFormat },
) => Promise<void>;

export type BackendDefinition = Record<RequestType, HandleRequest | undefined>;

/**
 * BackendType is an enum of all the supported backend types.
 */
export enum BackendType {
  GRPC_WEB = "grpc-web",
}

/**
 * Backends is a map of backend types to their definitions.
 * When adding a new backend, add it here.
 */
export const backends: Record<BackendType, BackendDefinition> = {
  [BackendType.GRPC_WEB]: grpcWebBackend,
};
