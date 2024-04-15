"use client";
import { useSourceContext } from "@/contexts/SourceContext";
import {
  getEnumsFromContext,
  getServicesFromContext,
  getTypesFromContext,
} from "@/services/protobufjs";
import Service from "@/components/parts/Service";
import Type from "@/components/parts/Type";
import EnumType from "@/components/parts/EnumType";
import { Spinner } from "react-bootstrap";
import { FILTERED_NAMESPACES } from "@/types/constants";
import JSONBlock from "@/components/JSONBlock";

/**
 * List of services, types and enums
 */
export default function Endpoints() {
  const { context, error } = useSourceContext();

  if (!!error) {
    return (
      <div className="d-grid justify-content-center text-center alert alert-danger">
        <div>
          An Error has occurred while fetching the data, please try it again.
        </div>
        <div className="mt-2">
          <JSONBlock>{error.message}</JSONBlock>
        </div>
      </div>
    );
  }

  if (!context) {
    return (
      <div className="d-grid justify-content-center">
        <Spinner animation="border" />
      </div>
    );
  }

  const services = getServicesFromContext(context);
  const types = getTypesFromContext(context).filter((type) => {
    return !FILTERED_NAMESPACES.includes(type.fullName.split(".")[1]);
  });
  const enums = getEnumsFromContext(context).filter((type) => {
    return !FILTERED_NAMESPACES.includes(type.fullName.split(".")[1]);
  });

  return (
    <div>
      <div data-testid="services">
        <h4>Services</h4>
        {services.map((service) => (
          <Service key={service.fullName} service={service} />
        ))}
        {services.length === 0 && (
          <div className="text-secondary fst-italic">No services found</div>
        )}
      </div>
      <div data-testid="types" className="mt-5">
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
      <div data-testid="enums" className="mt-5">
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
