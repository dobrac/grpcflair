"use client";
import { useSourceContext } from "@/contexts/SourceContext";
import Loading from "@/components/Loading";
import { Button } from "react-bootstrap";
import { makeGrpcCall, run } from "@/types/grpc-web";
import {
  getServicesFromContext,
  getTypesFromContext,
} from "@/types/protobufjs";

export default function Endpoint() {
  const { context } = useSourceContext();

  const services = context ? getServicesFromContext(context) : [];
  const types = context ? getTypesFromContext(context) : [];

  const runTest = () => {
    if (!context) return;
    run(context);
  };

  if (!context) return <Loading />;

  return (
    <div>
      <div>
        <h3>Services</h3>
        {services.map((service) => (
          <div key={service.name} className="card">
            <h3>{service.name}</h3>
            <div>
              {Object.values(service.methods).map((method) => (
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
                      <div>
                        Streaming: {(method.requestStream ?? false).toString()}
                      </div>
                    </div>
                    <div>
                      <h5>Response</h5>
                      <div>Type: {method.responseType}</div>
                      <div>
                        Streaming: {(method.responseStream ?? false).toString()}
                      </div>
                    </div>
                    <div>
                      <Button
                        size="sm"
                        onClick={() => {
                          const RequestType = context.lookupType(
                            // TODO: Include full path?
                            method.requestType,
                          );
                          const ResponseType = context.lookupType(
                            // TODO: Include full path?
                            method.responseType,
                          );

                          const message = RequestType.create({
                            name: "WorldAha",
                          });

                          makeGrpcCall(
                            service,
                            method,
                            RequestType,
                            ResponseType,
                            message,
                            (err, response) => {
                              if (err) throw err;
                              console.log(
                                "Greeting:",
                                ResponseType.toObject(response, {}).message,
                              );
                            },
                          );
                        }}
                      >
                        Call
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <h3>Types</h3>
        {types.map((type) => (
          <div key={type.name} className="card">
            <h4>{type.name}</h4>
            <div className="card ps-3">
              {Object.values(type.fields).map((field) => (
                <div key={field.name}>
                  <div className="text-secondary fst-italic">
                    {field.comment}
                  </div>
                  <div>
                    {field.name}: {field.type} (id: {field.id})
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/*<pre>{JSON.stringify(context, null, 2)}</pre>*/}
    </div>
  );
}
