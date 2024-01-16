import protobuf from "protobufjs";
import Field from "@/components/parts/Field";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";
import { useState } from "react";

export interface EnumProps {
  enumType: protobuf.Enum;
  dark?: boolean;
  expanded?: boolean;
}

export default function EnumType({ enumType, dark, expanded }: EnumProps) {
  const [open, setOpen] = useState(expanded ?? false);
  return (
    <div className="card px-2 py-1 d-inline-block">
      <button
        className={[
          "p-0 border-0 rounded-1 text-start btn bg-transparent hover-bg-darken",
          dark ? "text-light" : "",
        ].join(" ")}
        onClick={() => setOpen((open) => !open)}
      >
        [Enum] <span className="fw-bolder">{enumType.fullName}</span>
        <span className="small text-secondary ms-2">{enumType.comment}</span>
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
            {Object.entries(enumType.values).map(([key, value]) => (
              <div key={key}>
                {key} = {value}{" "}
                {!!enumType.valuesOptions && (
                  <span>
                    [
                    {Object.entries(enumType.valuesOptions[key] ?? {}).map(
                      ([key, option]) => (
                        <div key={key} className="ms-3">
                          {key}: {option.toString()}
                        </div>
                      ),
                    )}
                    ]
                  </span>
                )}
              </div>
            ))}
          </div>
          <div>{"}"}</div>
        </>
      )}
    </div>
  );
}
