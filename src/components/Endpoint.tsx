"use client";
import { useSourceContext } from "@/contexts/SourceContext";
import Loading from "@/components/Loading";

export default function Endpoint() {
  const { context } = useSourceContext();

  if (!context) return <Loading />;

  return (
    <div>
      Endpoint:
      {context.files.map((file) => (
        <div key={file.name}>
          <h2>{file.name}</h2>
          <div>
            {file.services.map((service) => (
              <div key={service.name} className="card">
                <h3>{service.name}</h3>
                <div>
                  {service.methods.map((method) => (
                    <div key={method.name}>
                      <h4>{method.name}</h4>
                      <div className="card">
                        <h5>Request</h5>
                        <div>Type: {method.requestType}</div>
                        <div>
                          Streaming: {method.requestStreaming.toString()}
                        </div>
                      </div>
                      <div className="card">
                        <h5>Response</h5>
                        <div>Type: {method.responseType}</div>
                        <div>
                          Streaming: {method.responseStreaming.toString()}
                        </div>
                      </div>
                      <pre>{JSON.stringify(method, null, 2)}</pre>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div>
            {file.messages.map((message) => (
              <div key={message.name}>
                <h3>{message.name}</h3>
                <div>
                  {message.fields.map((field) => (
                    <div key={field.name}>
                      <h4>{field.name}</h4>
                      <div>
                        <pre>{JSON.stringify(field, null, 2)}</pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {/*<pre>{JSON.stringify(context, null, 2)}</pre>*/}
    </div>
  );
}
