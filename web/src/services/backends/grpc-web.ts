import PCancelable, { CancelError } from "p-cancelable";
import { BackendDefinition, HandleRequest } from "./common";
import {
  makeGrpcCall,
  makeGrpcServerStreamingCall,
  UnaryResponse,
} from "@/services/grpc-web-client";
import { RequestType } from "@/services/protobufjs";

const handleUnaryRequestGrpcWeb: HandleRequest = async (
  hostname,
  service,
  method,
  requestType,
  responseType,
  message,
  metadata,
  functions,
  options,
) => {
  const cancellablePromise = new PCancelable<UnaryResponse>(
    (resolve, reject, onCancel) => {
      const promise = makeGrpcCall(
        hostname,
        service,
        method,
        requestType,
        responseType,
        message,
        {
          metadata,
          format: options?.format,
        },
      );

      promise.then(resolve).catch(reject);
    },
  );

  const onCancel = () => {
    cancellablePromise.cancel();
  };
  functions.setCancelFunction?.(() => onCancel);

  const response = await cancellablePromise;

  functions.setResponse?.((it) => ({
    ...it,
    headers: response.headers,
    trailers: response.trailers,
    data: response.data?.map((it) => responseType.toObject(it, {})),
  }));
};

const handleServerStreamingRequestGrpcWeb: HandleRequest = async (
  hostname,
  service,
  method,
  requestType,
  responseType,
  message,
  metadata,
  functions,
  options,
) => {
  return new Promise<void>((resolve, reject) => {
    const stream = makeGrpcServerStreamingCall(
      hostname,
      service,
      method,
      requestType,
      responseType,
      message,
      {
        metadata,
        format: options?.format,
      },
    );
    const onCancel = () => {
      stream.cancel();
      reject(new CancelError("Canceled"));
    };

    functions.setCancelFunction?.(() => onCancel);

    stream.on("data", (data) => {
      const response = responseType.toObject(data, {});
      functions.setResponse?.((it) => ({
        ...it,
        data: [...(it?.data ?? []), response],
      }));
    });

    stream.on("metadata", (metadata) => {
      functions.setResponse?.((it) => ({
        ...it,
        headers: metadata,
      }));
    });

    stream.on("status", (status) => {
      functions.setResponse?.((it) => ({
        ...it,
        trailers: status.metadata,
      }));
    });

    stream.on("error", (error) => {
      reject(error);
    });

    stream.on("end", () => {
      resolve();
    });
  });
};

export const grpcWebBackend: BackendDefinition = {
  [RequestType.UNARY]: handleUnaryRequestGrpcWeb,
  [RequestType.SERVER_STREAMING]: handleServerStreamingRequestGrpcWeb,
  [RequestType.CLIENT_STREAMING]: undefined,
  [RequestType.BIDIRECTIONAL_STREAMING]: undefined,
};
