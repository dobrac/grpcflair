import Method from "@/components/parts/method/Method";
import { Collapse } from "react-bootstrap";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons/faChevronUp";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import protobuf from "protobufjs";
import MethodContextProvider from "@/contexts/MethodContext";

export interface ServiceProps {
  service: protobuf.Service;
}

export default function Service({ service }: ServiceProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="d-grid pb-2">
      <button
        className="p-0 border-0 rounded-bottom-0 text-start btn hover-bg-darken py-2 "
        onClick={() => setOpen((open) => !open)}
      >
        <div className="d-flex justify-content-between align-items-center py-1 px-2">
          <div className="fw-bold fs-5">
            {service.fullName.replace(".", "")}
          </div>
          <div className="flex-grow-1 small text-secondary whitespace-pre ms-3">
            {service.comment}
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
