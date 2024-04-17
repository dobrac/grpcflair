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
import { Collapse, Spinner } from "react-bootstrap";
import { FILTERED_NAMESPACES } from "@/types/constants";
import JSONBlock from "@/components/JSONBlock";
import { useReducer } from "react";
import CollapsibleHeader from "@/components/CollapsibleHeader";

enum OpenAction {
  TOGGLE,
}

enum Category {
  SERVICES,
  TYPES,
  ENUMS,
}

function openServices(
  state: Record<Category, boolean>,
  action: { type: OpenAction; target: Category },
) {
  switch (action.type) {
    case OpenAction.TOGGLE:
      return {
        ...state,
        [action.target]: !state[action.target],
      };
  }
}

/**
 * List of services, types and enums
 */
export default function Endpoints() {
  const { context, error } = useSourceContext();

  const [openState, dispatchOpen] = useReducer(openServices, {
    [Category.SERVICES]: true,
    [Category.TYPES]: true,
    [Category.ENUMS]: true,
  });

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

  const categoryClasses = "w-100 ps-1 pe-2";

  return (
    <div>
      <div data-testid="services">
        <CollapsibleHeader
          className={categoryClasses}
          open={openState[Category.SERVICES]}
          onClick={() =>
            dispatchOpen({ type: OpenAction.TOGGLE, target: Category.SERVICES })
          }
        >
          <span className="h4 mb-0">Services</span>
        </CollapsibleHeader>
        <Collapse in={openState[Category.SERVICES]}>
          <div>
            {services.map((service) => (
              <Service key={service.fullName} service={service} />
            ))}
            {services.length === 0 && (
              <div className="text-secondary fst-italic">No services found</div>
            )}
          </div>
        </Collapse>
      </div>
      <div data-testid="types" className="mt-5">
        <CollapsibleHeader
          className={categoryClasses + " mb-2"}
          open={openState[Category.TYPES]}
          onClick={() =>
            dispatchOpen({ type: OpenAction.TOGGLE, target: Category.TYPES })
          }
        >
          <span className="h4 mb-0">Types</span>
        </CollapsibleHeader>
        <Collapse in={openState[Category.TYPES]}>
          <div>
            <div className="d-grid gap-2">
              {types.map((type) => (
                <Type key={type.fullName} type={type} />
              ))}
            </div>
            {types.length === 0 && (
              <div className="text-secondary fst-italic">No types found</div>
            )}
          </div>
        </Collapse>
      </div>
      <div data-testid="enums" className="mt-5">
        <CollapsibleHeader
          className={categoryClasses + " mb-2"}
          open={openState[Category.ENUMS]}
          onClick={() =>
            dispatchOpen({ type: OpenAction.TOGGLE, target: Category.ENUMS })
          }
        >
          <span className="h4 mb-0">Enums</span>
        </CollapsibleHeader>
        <Collapse in={openState[Category.ENUMS]}>
          <div>
            <div className="d-grid gap-2">
              {enums.map((enumType) => (
                <EnumType key={enumType.fullName} enumType={enumType} />
              ))}
            </div>
            {types.length === 0 && (
              <div className="text-secondary fst-italic">No types found</div>
            )}
          </div>
        </Collapse>
      </div>
    </div>
  );
}
