import { Button, Spinner } from "react-bootstrap";
import protobuf from "protobufjs";
import PCancelable, { CancelError } from "p-cancelable";
import { makeGrpcCall, makeGrpcServerStreamingCall } from "@/services/grpc-web";
import { useMethodContext } from "@/contexts/MethodContext";
import { useSourceContext } from "@/contexts/SourceContext";

export default function MethodExecute({
  service,
  method,
}: {
  service: protobuf.Service;
  method: protobuf.Method;
}) {
  method.resolve();

  const { hostname } = useSourceContext();
  const { processing, request, response, functions } = useMethodContext();

  const requestType = method.resolvedRequestType;
  const responseType = method.resolvedResponseType;

  if (!requestType || !responseType) {
    return null;
  }

  const handleUnaryRequest = async (message: protobuf.Message<{}>) => {
    const cancellablePromise = new PCancelable<protobuf.Message<{}>>(
      (resolve, reject, onCancel) => {
        const promise = makeGrpcCall(
          hostname,
          service,
          method,
          requestType,
          responseType,
          message,
          {
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
      data: [responseType.toObject(response, {})],
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

      stream.on("error", (error) => {
        reject(error);
      });

      stream.on("end", () => {
        resolve();
      });
    });
  };

  const handleExecute = async () => {
    try {
      functions.setCancelFunction(() => {});
      functions.setResponse(undefined);

      const message = requestType.create(request.data ?? {});

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
      <Button size="sm" disabled={processing} onClick={handleExecute}>
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
