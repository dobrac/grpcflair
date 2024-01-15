import { Badge, Button, Collapse, ProgressBar, Spinner } from "react-bootstrap";
import { makeGrpcCall, makeGrpcServerStreamingCall } from "@/types/grpc-web";
import protobuf from "protobufjs";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons/faChevronUp";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import YesNoIcon from "@/components/YesNoIcon";
import Type from "@/components/parts/Type";
import SyntaxHighlighter from "react-syntax-highlighter";
import docco from "react-syntax-highlighter/dist/esm/styles/hljs/docco";
import { serializeFieldDefaultValuesToJSON } from "@/types/protobufjs";
import InputFieldValue from "@/components/parts/inputfields/InputFieldValue";
import { RpcError } from "grpc-web";
import { useSourceContext } from "@/contexts/SourceContext";
import InputFieldName from "@/components/parts/inputfields/InputFieldName";
import PCancelable, { CancelError } from "p-cancelable";

enum RequestType {
  UNARY,
  CLIENT_STREAMING,
  SERVER_STREAMING,
  BIDIRECTIONAL_STREAMING,
}

function getRequestType(method: protobuf.Method): RequestType {
  if (method.requestStream && method.responseStream) {
    return RequestType.BIDIRECTIONAL_STREAMING;
  } else if (method.requestStream) {
    return RequestType.CLIENT_STREAMING;
  } else if (method.responseStream) {
    return RequestType.SERVER_STREAMING;
  } else {
    return RequestType.UNARY;
  }
}

function getColorFromMethod(method: protobuf.Method) {
  switch (getRequestType(method)) {
    case RequestType.BIDIRECTIONAL_STREAMING:
    case RequestType.CLIENT_STREAMING:
      return "danger";
    case RequestType.SERVER_STREAMING:
      return "dark";
    case RequestType.UNARY:
      return "success";
  }
}

function getMethodType(method: protobuf.Method) {
  switch (getRequestType(method)) {
    case RequestType.BIDIRECTIONAL_STREAMING:
      return "Bi-directional streaming";
    case RequestType.CLIENT_STREAMING:
      return "Client streaming";
    case RequestType.SERVER_STREAMING:
      return "Server streaming";
    case RequestType.UNARY:
      return "Unary";
  }
}

export interface ServiceProps {
  service: protobuf.Service;
  method: protobuf.Method;
}

export default function Method({ service, method }: ServiceProps) {
  method.resolve();

  const { hostname } = useSourceContext();
  const [open, setOpen] = useState(false);
  const [cancelFunction, setCancelFunction] = useState<(() => void) | null>(
    null,
  );
  const [error, setError] = useState<Error | null>(null);

  const RequestType = service.lookupType(
    // TODO: Include full path?
    method.requestType,
  );
  const ResponseType = service.lookupType(
    // TODO: Include full path?
    method.responseType,
  );

  const defaultRequestData = serializeFieldDefaultValuesToJSON(
    RequestType.fields,
  );
  const [requestData, setRequestData] =
    useState<Record<string, unknown>>(defaultRequestData);
  const [response, setResponse] = useState<unknown[]>([]);

  const processing = cancelFunction !== null;

  const handleUnaryRequest = async (message: protobuf.Message<{}>) => {
    const cancellablePromise = new PCancelable<protobuf.Message<{}>>(
      (resolve, reject, onCancel) => {
        const promise = makeGrpcCall(
          hostname,
          service,
          method,
          RequestType,
          ResponseType,
          message,
        );

        promise.then(resolve).catch(reject);
      },
    );

    const onCancel = () => {
      cancellablePromise.cancel();
    };
    setCancelFunction(() => onCancel);

    const response = await cancellablePromise;

    setResponse([ResponseType.toObject(response, {})]);
  };

  const handleServerStreaming = (message: protobuf.Message<{}>) => {
    return new Promise<void>((resolve, reject) => {
      const stream = makeGrpcServerStreamingCall(
        hostname,
        service,
        method,
        RequestType,
        ResponseType,
        message,
      );
      const onCancel = () => {
        stream.cancel();
        reject(new CancelError("Canceled"));
      };

      setCancelFunction(() => onCancel);

      stream.on("data", (data) => {
        const response = ResponseType.toObject(data, {});
        setResponse((responses) => [...responses, response]);
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
      setCancelFunction(() => {});
      setResponse([]);
      setError(null);

      const message = RequestType.create(requestData);

      // TODO: Support request streaming
      if (method.requestStream) {
        throw new Error(
          "Request streaming is not supported yet (client or bi-directional)",
        );
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
        setError(e);
      }
      if (e instanceof CancelError) {
        setError(new Error("Request canceled"));
      }
    } finally {
      setCancelFunction(null);
    }
  };

  const color = getColorFromMethod(method);

  return (
    <div key={method.name} className={"card bg-" + color + "-subtle"}>
      <button
        className="p-0 border-0 rounded-bottom-0 text-start btn hover-bg-darken py-2 px-3"
        onClick={() => setOpen((open) => !open)}
      >
        <div className="d-flex align-items-center gap-2">
          <Badge bg={color}>{getMethodType(method)}</Badge>
          <div className="fw-bold fs-6">
            {method.name}
            {!!method.requestStream && (
              <span className="fw-normal small text-secondary fst-italic ms-1">
                (Not supported yet)
              </span>
            )}
          </div>
          <div className="flex-grow-1 small text-secondary ms-1">
            {method.comment}
          </div>
          <div>
            {open ? (
              <FontAwesomeIcon icon={faChevronUp} />
            ) : (
              <FontAwesomeIcon icon={faChevronDown} />
            )}
          </div>
        </div>
      </button>
      <hr className="m-0" />
      <Collapse in={open}>
        <div>
          <div className="py-3 px-4 bg-light">
            <span className="fw-bolder">Parameters</span>
            {!!method.requestStream && (
              <span>
                streaming: <YesNoIcon value={true} className="ms-1" />
              </span>
            )}
          </div>
          <hr className="m-0" />
          <div className="py-2 px-4">
            <table className="w-100">
              <thead className="border-bottom border-secondary-subtle small">
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(RequestType.fields).map((field) => (
                  <tr key={field.name}>
                    <td className="align-top py-3">
                      <InputFieldName field={field} />
                    </td>
                    <td className="align-top py-3">
                      <div className="text-secondary">{field.comment}</div>
                      <InputFieldValue
                        field={field}
                        value={requestData[field.name]}
                        onChange={(value) => {
                          setRequestData((it) => {
                            return {
                              ...it,
                              [field.name]: value,
                            };
                          });
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                    cancelFunction();
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
          <hr className="m-0" />
          <div className="py-3 px-4 bg-light">
            <span className="fw-bolder">Responses</span>
            {!!method.responseStream && (
              <span>
                streaming: <YesNoIcon value={true} className="ms-1" />
              </span>
            )}
          </div>
          <hr className="m-0" />
          <div className="py-2 px-4 d-grid gap-4">
            <div className="d-grid gap-2">
              <div className="fw-bolder small">Request server</div>
              <div className="bg-dark text-light py-1 rounded-1 m-0 px-2">
                {hostname}
              </div>
            </div>
            <div className="d-grid gap-2">
              <div className="fw-bolder small">Server responses</div>
              {!response.length && !error && (
                <span className="small">No response yet</span>
              )}
              {processing && <ProgressBar animated now={100} />}
              {!!response.length && (
                <div className="d-grid gap-2">
                  {response.map((response, index) => (
                    <div key={index}>
                      <SyntaxHighlighter
                        language="json"
                        style={docco}
                        className="bg-dark text-light p-1 rounded-1 m-0"
                      >
                        {JSON.stringify(response, null, 2)}
                      </SyntaxHighlighter>
                    </div>
                  ))}
                </div>
              )}
              {!!error && (
                <div className="text-white bg-danger p-2 rounded-1">
                  {error instanceof RpcError && (
                    <>
                      <div>Error {error.code}</div>
                    </>
                  )}
                  <div>{error.message}</div>
                  {error instanceof RpcError && (
                    <>
                      <div>Metadata</div>
                      <SyntaxHighlighter
                        language="json"
                        style={docco}
                        className="bg-dark text-light p-1 rounded-1 m-0"
                      >
                        {JSON.stringify(error.metadata, null, 2)}
                      </SyntaxHighlighter>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="d-grid gap-2">
              <div className="fw-bolder small">Responses</div>
              <table className="w-100">
                <thead className="border-bottom border-secondary-subtle small">
                  <tr>
                    <th>Code</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="align-top">0</td>
                    <td className="py-2">
                      <Type type={ResponseType} dark expanded={true} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  );
}
