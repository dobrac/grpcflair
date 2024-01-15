import protobuf from "protobufjs";
import Field from "@/components/parts/Field";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";

export interface TypeProps {
  type: protobuf.Type;
  dark?: boolean;
  expanded?: boolean;
}

export default function Type({ type, dark, expanded }: TypeProps) {
  const [open, setOpen] = useState(expanded ?? false);

  return (
    <div
      className={[
        "card px-2 py-1 d-inline-block",
        dark ? "bg-dark text-light" : "",
      ].join(" ")}
    >
      <button
        className={[
          "p-0 border-0 rounded-1 text-start btn bg-transparent hover-bg-darken",
          dark ? "text-light" : "",
        ].join(" ")}
        onClick={() => setOpen((open) => !open)}
      >
        <span className="fw-bolder">{type.fullName}</span>
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
            {Object.values(type.fields).map((field) => (
              <Field key={field.name} field={field} dark={dark} />
            ))}
          </div>
          <div>{"}"}</div>
        </>
      )}
    </div>
  );
}
