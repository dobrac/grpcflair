import { useSourceContext } from "@/contexts/SourceContext";
import Loading from "@/components/Loading";
import { Button, Form } from "react-bootstrap";
import { makeGrpcCall, run } from "@/types/grpc-web";
import protobuf from "protobufjs";
import { useState } from "react";

export interface ServiceProps {
  service: protobuf.Service;
  method: protobuf.Method;
}

export default function Method({ service, method }: ServiceProps) {
  const { context } = useSourceContext();
  const [processing, setProcessing] = useState<boolean>(false);
  const [fieldValue, setFieldValue] = useState<string>("");
  const [response, setResponse] = useState<unknown | undefined>(undefined);

  const runTest = () => {
    if (!context) return;
    run(context);
  };

  if (!context) return <Loading />;

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
        <Button size="sm" onClick={runTest}>
          runTest
        </Button>
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
                    onChange={(e) => setFieldValue(e.target.value)}
                    value={fieldValue}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2">
            <Button
              size="sm"
              disabled={processing}
              onClick={async () => {
                try {
                  setProcessing(true);

                  // TODO: Support request streaming
                  if (method.requestStream) {
                    throw new Error(
                      "Request streaming is not supported yet (client or bi-directional)",
                    );
                  }

                  const message = RequestType.create({
                    [Object.values(RequestType.fields)[0].name]: fieldValue,
                  });

                  const response = await makeGrpcCall(
                    service,
                    method,
                    RequestType,
                    ResponseType,
                    message,
                  );

                  setResponse(ResponseType.toObject(response, {}));
                } finally {
                  setProcessing(false);
                }
              }}
            >
              Call
            </Button>
          </div>
        </div>
        <div className="mt-3">
          <h5>Response</h5>
          <pre>
            {!processing && response
              ? JSON.stringify(response, null, 2)
              : "No response yet"}
          </pre>
          <div>Type: {method.responseType}</div>
          <div>Streaming: {(method.responseStream ?? false).toString()}</div>
        </div>
      </div>
    </div>
  );
}
