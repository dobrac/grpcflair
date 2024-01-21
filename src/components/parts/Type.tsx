import protobuf from "protobufjs";
import Field from "@/components/parts/Field";
import { Fragment, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";
import { compact, filter, isNull, omit, omitBy, uniqBy } from "lodash";

export interface TypeProps {
  type: protobuf.Type;
  dark?: boolean;
  expanded?: boolean;
}

export default function Type({ type, dark, expanded }: TypeProps) {
  const [open, setOpen] = useState(expanded ?? false);

  const fields = Object.values(type.fields);
  const oneOfFields = uniqBy(
    compact(fields.map((it) => it.partOf)),
    (it) => it.fullName,
  );

  const fieldsWithoutOneOf = fields.filter((it) => !it.partOf);

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
        <span className="small text-secondary ms-2">{type.comment}</span>
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
            {oneOfFields.map((field) => (
              <Fragment key={field.fullName}>
                oneof <span className="fw-bolder">{field.name}</span>
                {" {"}
                <div className="ps-3">
                  {field.fieldsArray.map((field) => (
                    <Field key={field.name} field={field} dark={dark} />
                  ))}
                </div>
                {"}"}
              </Fragment>
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
