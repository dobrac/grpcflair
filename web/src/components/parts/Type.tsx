import protobuf from "protobufjs";
import Field from "@/components/parts/field/Field";
import { Fragment, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";
import { getOptionsFromReflectionObject } from "@/services/protobufjs";
import OneOfField from "@/components/parts/field/OneOfField";
import Options from "@/components/parts/helpers/Options";

export interface TypeProps {
  type: protobuf.Type;
  dark?: boolean;
  expanded?: boolean;
}

export default function Type({ type, dark, expanded }: TypeProps) {
  const [open, setOpen] = useState(expanded ?? false);

  const fields = type.fieldsArray;
  const oneOfFields = type.oneofsArray;

  const fieldsWithoutOneOf = fields.filter((it) => !it.partOf);

  const reservedFields =
    type.reserved?.map((it) => {
      if (typeof it === "string") {
        return it;
      }
      if (Array.isArray(it)) {
        const [from, to] = it;
        if (from === to) {
          return `${from}`;
        } else {
          return `${from}-${to}`;
        }
      }
      return `${it}`;
    }) ?? [];

  return (
    <div
      className={[
        "card px-2 py-1 d-inline-block text-break",
        dark ? "bg-dark text-light" : "",
      ].join(" ")}
      data-testid="type-detail"
    >
      <button
        className={[
          "p-0 border-0 rounded-1 text-start btn bg-transparent hover-bg-darken",
          dark ? "text-light" : "",
        ].join(" ")}
        onClick={() => setOpen((open) => !open)}
      >
        <span className="fw-bolder">{type.fullName}</span>
        <span className="small text-secondary ms-2 whitespace-pre">
          {type.comment}
        </span>
        <span className="mx-2">
          {open ? (
            <FontAwesomeIcon icon={faChevronDown} />
          ) : (
            <FontAwesomeIcon icon={faChevronRight} />
          )}
        </span>
        {"{"}
        {!open && "...}"}
      </button>
      {open && (
        <>
          <div className="ps-3">
            <Options reflectionObject={type} className="mb-2" />
            {!!reservedFields.length && (
              <div className="small text-secondary mb-1">
                <span>reserved </span>
                <span>{reservedFields.join(", ")}</span>
              </div>
            )}
            {oneOfFields.map((oneOf) => (
              <OneOfField field={oneOf} dark={dark} key={oneOf.fullName} />
            ))}
            {fieldsWithoutOneOf.map((field) => (
              <Field key={field.name} field={field} dark={dark} />
            ))}
          </div>
          <div>{"}"}</div>
        </>
      )}
    </div>
  );
}
