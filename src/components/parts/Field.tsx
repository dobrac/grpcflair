import protobuf, { MapField } from "protobufjs";
import Type from "@/components/parts/Type";
import { useState } from "react";
import { Button } from "react-bootstrap";
import EnumType from "@/components/parts/EnumType";

export interface FieldProps {
  field: protobuf.Field;
}

export default function Field({ field }: FieldProps) {
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
      {field.map && "<" + (field as unknown as MapField).keyType + ", "}
      <span className="text-secondary">
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
      {field.partOf ? " (part of " + field.partOf.name + ")" : ""}
      {field.comment && (
        <span className="text-secondary fst-italic ms-1">{field.comment}</span>
      )}
      {!!resolvedType && resolvedType instanceof protobuf.Type && open && (
        <Type type={resolvedType} />
      )}
      {!!resolvedType && resolvedType instanceof protobuf.Enum && open && (
        <EnumType enumType={resolvedType} />
      )}
    </div>
  );
}
