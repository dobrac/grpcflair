import protobuf, { MapField } from "protobufjs";
import Type from "@/components/parts/Type";
import { useState } from "react";
import { Button } from "react-bootstrap";
import EnumType from "@/components/parts/EnumType";

export interface FieldProps {
  field: protobuf.Field;
  dark?: boolean;
}

export default function Field({ field, dark }: FieldProps) {
  field.resolve();

  const [open, setOpen] = useState(false);

  let resolvedType = field.resolvedType;

  const expandable = !!resolvedType;

  return (
    <div>
      <span className="fw-bolder">
        {field.name}
        {field.required ? "*" : ""}
      </span>
      {": "}
      {field.map && "map<" + (field as unknown as MapField).keyType + ", "}
      <span className={dark ? "text-white" : "text-secondary"}>
        {expandable ? (
          <Button
            size="sm"
            variant="link"
            className="px-0"
            onClick={() => setOpen((open) => !open)}
          >
            {field.type}
          </Button>
        ) : (
          field.type
        )}
      </span>
      {field.map && ">"}
      {field.repeated ? "[]" : ""}
      {/*{field.optional ? " (optional)" : ""}*/}
      {field.comment && (
        <span
          className={[
            "fst-italic ms-1",
            dark ? "text-white" : "text-secondary",
          ].join(" ")}
        >
          {field.comment}
        </span>
      )}
      <div>
        {!!resolvedType && resolvedType instanceof protobuf.Type && open && (
          <Type type={resolvedType} dark={dark} expanded={true} />
        )}
        {!!resolvedType && resolvedType instanceof protobuf.Enum && open && (
          <EnumType enumType={resolvedType} dark={dark} expanded={true} />
        )}
      </div>
    </div>
  );
}
