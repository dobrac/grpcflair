import { Button, Spinner } from "react-bootstrap";
import protobuf from "protobufjs";
import { CancelError } from "p-cancelable";
import { useMethodContext } from "@/contexts/MethodContext";
import { useSourceContext } from "@/contexts/SourceContext";
import { useFormContext } from "react-hook-form";
import { cleanEmptyValues } from "@/services/json";
import { useMetadataContext } from "@/contexts/MetadataContext";
import { backends, BackendType } from "@/services/backends/common";
import {
  getRequestType,
  getRequestTypeDisplayName,
  RequestType,
} from "@/services/protobufjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons/faPlay";

const ERROR_DELIMITER = ": ";

const SELECTED_BACKEND = BackendType.GRPC_WEB;

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

  const handleRequest = async (
    type: RequestType,
    message: protobuf.Message<{}>,
  ) => {
    const backend = backends[SELECTED_BACKEND][type];
    if (!backend) {
      functions.setResponse((it) => ({
        ...it,
        error: new Error(
          `${getRequestTypeDisplayName(type)} is not supported yet`,
        ),
      }));
      return;
    }
    await backend(
      hostname,
      service,
      method,
      requestType,
      responseType,
      message,
      metadata,
      functions,
      {
        format: request.format,
      },
    );
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
        const [fieldName, ...error] = err.split(ERROR_DELIMITER);
        setError(fieldName, {
          type: "manual",
          message:
            'Protobuf type or value is invalid: "' +
            error.join(ERROR_DELIMITER) +
            '"',
        });
        return;
      }

      // Construct protobufjs message
      const message = requestType.create(dataTransformed);

      const type = getRequestType(method);
      await handleRequest(type, message);
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        const error = e;
        functions.setResponse((it) => ({
          ...it,
          error,
        }));
      }
      if (e instanceof CancelError) {
        functions.setResponse((it) => ({
          ...it,
          error: new Error("Request canceled"),
        }));
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
      <div
        className="d-grid gap-1"
        style={{
          gridTemplateColumns: "repeat(auto-fill, 1fr)",
          gridAutoFlow: "column",
        }}
      >
        <Button
          size="sm"
          variant={isValid ? "success" : "danger"}
          disabled={processing || !isValid}
          onClick={handleSubmit(handleExecute)}
          data-testid="method-execute-button"
          className="border border-1 border-dark"
        >
          <span className="me-2">
            {processing ? (
              <Spinner size="sm" />
            ) : (
              <FontAwesomeIcon icon={faPlay} />
            )}
          </span>
          Execute
        </Button>
        {processing && (
          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              functions.cancel?.();
            }}
            data-testid="method-cancel-button"
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
