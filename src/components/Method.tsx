import { Button, Collapse, Form, ProgressBar } from "react-bootstrap";
import { makeGrpcCall, makeGrpcServerStreamingCall } from "@/types/grpc-web";
import protobuf from "protobufjs";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons/faChevronUp";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import YesNoIcon from "@/components/YesNoIcon";
import Type from "@/components/Type";
import SyntaxHighlighter from "react-syntax-highlighter";
import docco from "react-syntax-highlighter/dist/esm/styles/hljs/docco";

export interface ServiceProps {
  service: protobuf.Service;
  method: protobuf.Method;
}

export default function Method({ service, method }: ServiceProps) {
  const [open, setOpen] = useState(false);

  const [processing, setProcessing] = useState<(() => void) | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<unknown[]>([]);

  const RequestType = service.lookupType(
    // TODO: Include full path?
    method.requestType,
  );
  const ResponseType = service.lookupType(
    // TODO: Include full path?
    method.responseType,
  );

  return (
    <div key={method.name} className="card">
      <button
        className="p-0 border-0 rounded-bottom-0 text-start btn hover-bg-darken py-2 px-3"
        onClick={() => setOpen((open) => !open)}
      >
        <div className="d-flex align-items-center gap-2">
          <div className="fw-bold fs-6">{method.name}</div>
          <div className="flex-grow-1 small text-secondary">
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
            <div>
              {Object.values(RequestType.fields).map((field) => (
                <div key={field.name}>
                  <div>
                    <div>
                      <span className="fw-bolder">{field.name}</span>
                      <span className="ms-1 text-secondary fst-italic">
                        {field.comment}
                      </span>
                    </div>
                    <div>
                      <span className="text-secondary">
                        {field.type.toString()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Form.Control
                      as="input"
                      placeholder={field.name}
                      onChange={(e) =>
                        setFieldValues((fieldValues) => ({
                          ...fieldValues,
                          [field.name]: e.target.value,
                        }))
                      }
                      value={fieldValues[field.name] ?? ""}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 d-grid gap-1">
              <Button
                size="sm"
                disabled={!!processing}
                onClick={async () => {
                  try {
                    setProcessing(() => {});
                    setResponse([]);

                    // TODO: Support request streaming
                    if (method.requestStream) {
                      throw new Error(
                        "Request streaming is not supported yet (client or bi-directional)",
                      );
                    }

                    const message = RequestType.create(fieldValues);

                    if (method.responseStream) {
                      await new Promise<void>((resolve, reject) => {
                        const stream = makeGrpcServerStreamingCall(
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
            {!response.length && <span>No response yet</span>}
            {!!processing && <ProgressBar animated now={100} />}
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
          </div>
        </div>
      </Collapse>
    </div>
  );
}
