"use client";
import { useSourceContext } from "@/contexts/SourceContext";
import {
  getEnumsFromContext,
  getServicesFromContext,
  getTypesFromContext,
} from "@/types/protobufjs";
import Service from "@/components/parts/Service";
import Type from "@/components/parts/Type";
import EnumType from "@/components/parts/EnumType";

export default function Endpoints() {
  const { context } = useSourceContext();

  const services = context ? getServicesFromContext(context) : [];
  const types = context ? getTypesFromContext(context) : [];
  const enums = context ? getEnumsFromContext(context) : [];

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
      <div className="mt-5">
        <h4>Enums</h4>
        <div className="d-grid gap-2">
          {enums.map((enumType) => (
            <EnumType key={enumType.fullName} enumType={enumType} />
          ))}
        </div>
        {types.length === 0 && (
          <div className="text-secondary fst-italic">No types found</div>
        )}
      </div>
    </div>
  );
}
