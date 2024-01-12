"use client";
import { useSourceContext } from "@/contexts/SourceContext";
import Loading from "@/components/Loading";
import { run } from "@/types/grpc-web";
import {
  getServicesFromContext,
  getTypesFromContext,
} from "@/types/protobufjs";
import Method from "@/components/Method";

export default function Endpoints() {
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
                <Method key={method.name} service={service} method={method} />
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
