import Method from "@/components/parts/method/Method";
import { Collapse } from "react-bootstrap";
import { useState } from "react";
import protobuf from "protobufjs";
import MethodContextProvider from "@/contexts/MethodContext";
import Options from "@/components/parts/helpers/Options";
import CollapsibleHeader from "@/components/CollapsibleHeader";

export interface ServiceProps {
  service: protobuf.Service;
}

export default function Service({ service }: ServiceProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="d-grid pb-2" data-testid="service-detail">
      <CollapsibleHeader
        open={open}
        onClick={() => setOpen((open) => !open)}
        className="border-0 rounded-bottom-0 px-2"
      >
        <div className="py-1 d-grid gap-2">
          <div>
            <span className="fw-bold fs-5">
              {service.fullName.replace(".", "")}
            </span>
            <span className="small text-secondary whitespace-pre-wrap mx-3">
              {service.comment}
            </span>
          </div>
          <Options reflectionObject={service} />
        </div>
      </CollapsibleHeader>
      <hr className="m-0" />
      <Collapse in={open}>
        <div>
          <div className="my-2 d-grid gap-3">
            {Object.values(service.methods).map((method) => (
              <MethodContextProvider key={method.name} method={method}>
                <Method service={service} method={method} />
              </MethodContextProvider>
            ))}
          </div>
        </div>
      </Collapse>
    </div>
  );
}
