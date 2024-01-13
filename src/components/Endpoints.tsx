"use client";
import { useSourceContext } from "@/contexts/SourceContext";
import {
  getServicesFromContext,
  getTypesFromContext,
} from "@/types/protobufjs";
import Service from "@/components/Service";
import Type from "@/components/Type";

export default function Endpoints() {
  const { context } = useSourceContext();

  const services = context ? getServicesFromContext(context) : [];
  const types = context ? getTypesFromContext(context) : [];

  return (
    <div>
      <div>
        <h4>Services</h4>
        {services.map((service) => (
          <Service key={service.fullName} service={service} />
        ))}
        {services.length === 0 && (
          <div className="text-secondary fst-italic">No services found</div>
        )}
      </div>
      <div className="mt-5">
        <h4>Types</h4>
        <div className="d-grid gap-2">
          {types.map((type) => (
            <Type key={type.fullName} type={type} />
          ))}
        </div>
        {types.length === 0 && (
          <div className="text-secondary fst-italic">No types found</div>
        )}
      </div>
    </div>
  );
}
