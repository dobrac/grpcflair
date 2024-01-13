import { Button, Form } from "react-bootstrap";
import { makeGrpcCall, makeGrpcServerStreamingCall } from "@/types/grpc-web";
import protobuf from "protobufjs";
import { useState } from "react";

export interface ServiceProps {
  service: protobuf.Service;
  method: protobuf.Method;
}

export default function Method({ service, method }: ServiceProps) {
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
    <div key={method.name}>
      <div className="d-flex gap-3 align-items-center my-2">
        <h4 className="m-0">{method.name}</h4>
      </div>
      <div className="card ps-4">
        <div>
          <h5>Request</h5>
          <div>Type: {method.requestType}</div>
          <div>Streaming: {(method.requestStream ?? false).toString()}</div>
          <div>
            {Object.values(RequestType.fields).map((field) => (
              <div key={field.name}>
                <div className="text-secondary fst-italic">{field.comment}</div>
                <div>{field.name}</div>
                <div>
                  <Form.Control
                    as="input"
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
          <div className="mt-2">
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
              Call
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
        <div className="mt-3">
          <h5>Response</h5>
          <div>Processing: {(!!processing).toString()}</div>
          <pre>
            {response ? JSON.stringify(response, null, 2) : "No response yet"}
          </pre>
          <div>Type: {method.responseType}</div>
          <div>Streaming: {(method.responseStream ?? false).toString()}</div>
        </div>
      </div>
    </div>
  );
}
