import { Button, Spinner } from "react-bootstrap";
import protobuf from "protobufjs";
import PCancelable, { CancelError } from "p-cancelable";
import {
  makeGrpcCall,
  makeGrpcServerStreamingCall,
  UnaryResponse,
} from "@/services/grpc-web";
import { useMethodContext } from "@/contexts/MethodContext";
import { useSourceContext } from "@/contexts/SourceContext";
import { useFormContext } from "react-hook-form";
import { cleanEmptyValues } from "@/services/json";
import { useMetadataContext } from "@/contexts/MetadataContext";

const errorDelimiter = ": ";

export default function RequestFormExecution({
  service,
  method,
}: {
  service: protobuf.Service;
  method: protobuf.Method;
}) {
  method.resolve();

  const { hostname } = useSourceContext();
  const { processing, request, response, functions } = useMethodContext();
  const {
    handleSubmit,
    formState: { isValid },
    setError,
  } = useFormContext();
  const { metadata } = useMetadataContext();

  const requestType = method.resolvedRequestType;
  const responseType = method.resolvedResponseType;

  if (!requestType || !responseType) {
    return <div>Unable to resolve request/response type</div>;
  }

  const handleUnaryRequest = async (message: protobuf.Message<{}>) => {
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
            format: request.format,
          },
        );

        promise.then(resolve).catch(reject);
      },
    );

    const onCancel = () => {
      cancellablePromise.cancel();
    };
    functions.setCancelFunction(() => onCancel);

    const response = await cancellablePromise;

    functions.setResponse((it) => ({
      ...it,
      headers: response.headers,
      trailers: response.trailers,
      data: response.data?.map((it) => responseType.toObject(it, {})),
    }));
  };

  const handleServerStreaming = (message: protobuf.Message<{}>) => {
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
          format: request.format,
        },
      );
      const onCancel = () => {
        stream.cancel();
        reject(new CancelError("Canceled"));
      };

      functions.setCancelFunction(() => onCancel);

      stream.on("data", (data) => {
        const response = responseType.toObject(data, {});
        functions.setResponse((it) => ({
          ...it,
          data: [...(it?.data ?? []), response],
        }));
      });

      stream.on("metadata", (metadata) => {
        functions.setResponse((it) => ({
          ...it,
          headers: metadata,
        }));
      });

      stream.on("status", (status) => {
        functions.setResponse((it) => ({
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

  const handleExecute = async (data: Record<string, unknown>) => {
    try {
      functions.setCancelFunction(() => {});
      functions.setResponse(undefined);

      const dataTransformed = cleanEmptyValues(data);

      functions.setRequest((it) => ({
        ...it,
        metadata: metadata,
        message: dataTransformed,
      }));

      // Validate model data
      const err = requestType.verify(dataTransformed);
      if (err) {
        const [fieldName, ...error] = err.split(errorDelimiter);
        setError(fieldName, {
          type: "manual",
          message:
            'Protobuf type or value is invalid: "' +
            error.join(errorDelimiter) +
            '"',
        });
        return;
      }

      // Construct protobufjs message
      const message = requestType.create(dataTransformed);

      // TODO: Support request streaming
      if (method.requestStream) {
        functions.setResponse({
          error: new Error(
            "Request streaming is not supported yet (client or bi-directional)",
          ),
        });
        return;
      }

      if (method.responseStream) {
        await handleServerStreaming(message);
      }

      if (!method.requestStream && !method.responseStream) {
        await handleUnaryRequest(message);
      }
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        functions.setResponse({
          error: e,
        });
      }
      if (e instanceof CancelError) {
        functions.setResponse({
          error: new Error("Request canceled"),
        });
      }
    } finally {
      functions.setCancelFunction(undefined);
    }
  };

  return (
    <div className="mt-2 d-grid gap-1">
      {!isValid && (
        <div className="text-danger">
          Problems found in the request. Please fix them before executing.
        </div>
      )}
      <Button
        size="sm"
        variant={isValid ? "primary" : "danger"}
        disabled={processing || !isValid}
        onClick={handleSubmit(handleExecute)}
      >
        <Spinner
          size="sm"
          className={processing ? "visible" : "visually-hidden"}
        />{" "}
        Execute
      </Button>
      {processing && (
        <Button
          size="sm"
          variant="danger"
          onClick={() => {
            functions.cancel?.();
          }}
        >
          Cancel
        </Button>
      )}
    </div>
  );
}