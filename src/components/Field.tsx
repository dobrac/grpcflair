import protobuf, { MapField } from "protobufjs";
import Type from "@/components/Type";
import { useState } from "react";
import { Button } from "react-bootstrap";
import EnumType from "@/components/EnumType";

export interface FieldProps {
  field: protobuf.Field;
}

export default function Field({ field }: FieldProps) {
  const [open, setOpen] = useState(false);

  let subType;
  try {
    subType = field.root.lookupType(field.type);
  } catch (e) {
    // Ignore, type not found
  }

  let subEnumType;
  try {
    subEnumType = field.root.lookupEnum(field.type);
  } catch (e) {
    // Ignore, type not found
  }

  const expandable = !!subType || !!subEnumType;

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
      {!!subType && open && <Type type={subType} />}
      {!!subEnumType && open && <EnumType enumType={subEnumType} />}
    </div>
  );
}
