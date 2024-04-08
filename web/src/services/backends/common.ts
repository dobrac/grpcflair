import protobuf from "protobufjs";
import { MethodFunctions } from "@/contexts/MethodContext";
import { GrpcWebFormat } from "@/types/grpc-web";
import { RequestType } from "@/services/protobufjs";
import { grpcWebBackend } from "@/services/backends/grpc-web";

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

export enum BackendType {
  GRPC_WEB = "grpc-web",
}

export const backends: Record<BackendType, BackendDefinition> = {
  [BackendType.GRPC_WEB]: grpcWebBackend,
};
