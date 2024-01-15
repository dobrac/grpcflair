import { Button, Collapse, Form, Nav, ProgressBar } from "react-bootstrap";
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
import InputField from "@/components/parts/InputField";
import { RpcError } from "grpc-web";
import { useSourceContext } from "@/contexts/SourceContext";

enum RequestInputType {
  UI = "ui",
  JSON = "json",
}

export interface ServiceProps {
  service: protobuf.Service;
  method: protobuf.Method;
}

export default function Method({ service, method }: ServiceProps) {
  const { hostname } = useSourceContext();
  const [open, setOpen] = useState(false);
  const [processing, setProcessing] = useState<(() => void) | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const RequestType = service.lookupType(
    // TODO: Include full path?
    method.requestType,
  );
  const ResponseType = service.lookupType(
    // TODO: Include full path?
    method.responseType,
  );

  const [requestInputType, setRequestInputType] = useState<RequestInputType>(
    RequestInputType.UI,
  );

  const defaultRequestData = serializeFieldDefaultValuesToJSON(
    RequestType.fields,
  );
  const [requestData, setRequestData] =
    useState<Record<string, unknown>>(defaultRequestData);
  const [response, setResponse] = useState<unknown[]>([]);

  return (
    <div key={method.name} className="card">
      <button
        className="p-0 border-0 rounded-bottom-0 text-start btn hover-bg-darken py-2 px-3"
        onClick={() => setOpen((open) => !open)}
      >
        <div className="d-flex align-items-center gap-2">
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
          <div className="py-2 px-4">
            <span className="fw-bolder">Parameters</span> {method.requestType}
            {!!method.requestStream && (
              <span>
                , streaming: <YesNoIcon value={true} className="ms-1" />
              </span>
            )}
          </div>
          <hr className="m-0" />
          <div className="py-2 px-4">
            <span className="text-secondary">Model</span>
            <Type type={RequestType} />
          </div>
          <div className="py-2 px-4">
            <div>
              <Nav
                variant="pills"
                activeKey={requestInputType}
                onSelect={(selectedKey) => {
                  setRequestInputType(
                    selectedKey as unknown as RequestInputType,
                  );
                }}
              >
                <Nav.Item>
                  <Nav.Link eventKey={RequestInputType.UI}>UI</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey={RequestInputType.JSON}>JSON</Nav.Link>
                </Nav.Item>
              </Nav>
              <div
                className={
                  requestInputType === RequestInputType.UI
                    ? "d-block"
                    : "d-none"
                }
              >
                {Object.values(RequestType.fields).map((field) => (
                  <InputField
                    key={field.name}
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
                ))}
              </div>
              <div
                className={
                  requestInputType === RequestInputType.JSON
                    ? "d-block"
                    : "d-none"
                }
              >
                <Form.Control
                  key={JSON.stringify(requestData)}
                  as="textarea"
                  rows={10}
                  defaultValue={JSON.stringify(requestData, null, 2)}
                  onBlur={(e) =>
                    setRequestData(
                      e.target.value ? JSON.parse(e.target.value) : {},
                    )
                  }
                />
              </div>
            </div>
            <div className="mt-2 d-grid gap-1">
              <Button
                size="sm"
                disabled={!!processing}
                onClick={async () => {
                  try {
                    setProcessing(() => {});
                    setResponse([]);
                    setError(null);

                    // TODO: Support request streaming
                    if (method.requestStream) {
                      throw new Error(
                        "Request streaming is not supported yet (client or bi-directional)",
                      );
                    }

                    const message = RequestType.create(requestData);

                    if (method.responseStream) {
                      await new Promise<void>((resolve, reject) => {
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
                          reject(new Error("Cancelled"));
                        };

                        setProcessing((processing) => {
                          return onCancel;
                        });

                        stream.on("data", (data) => {
                          const response = ResponseType.toObject(data, {});
                          setResponse((responses) => [...responses, response]);
                        });

                        stream.on("error", (error) => {
                          console.log("error", error);
                          reject(error);
                        });

                        stream.on("end", () => {
                          resolve();
                        });
                      });
                    } else {
                      const response = await makeGrpcCall(
                        hostname,
                        service,
                        method,
                        RequestType,
                        ResponseType,
                        message,
                      );

                      setResponse([ResponseType.toObject(response, {})]);
                    }
                  } catch (e) {
                    console.error(e);
                    if (e instanceof Error) {
                      setError(e);
                    }
                  } finally {
                    setProcessing(null);
                  }
                }}
              >
                Execute
              </Button>
              {!!processing && (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    processing();
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
          <hr className="m-0" />
          <div className="py-2 px-4">
            <span className="fw-bolder">Responses</span> {method.responseType}
            {!!method.responseStream && (
              <span>
                , streaming: <YesNoIcon value={true} className="ms-1" />
              </span>
            )}
          </div>
          <hr className="m-0" />
          <div className="py-2 px-4">
            <span className="text-secondary">Model</span>
            <Type type={ResponseType} />
          </div>
          <hr className="m-0" />
          <div className="py-2 px-4 d-grid gap-2">
            {!response.length && !error && <span>No response yet</span>}
            {!!processing && <ProgressBar animated now={100} />}
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
        </div>
      </Collapse>
    </div>
  );
}
