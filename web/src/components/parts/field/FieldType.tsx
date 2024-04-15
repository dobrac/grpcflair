import protobuf, { MapField } from "protobufjs";
import Type from "@/components/parts/Type";
import { useState } from "react";
import { Button } from "react-bootstrap";
import EnumType from "@/components/parts/EnumType";

export interface FieldTypeProps {
  field: protobuf.Field;
  dark?: boolean;
  expandable?: boolean;
  expanded?: boolean;
  className?: string;
}

export default function FieldType({
  field,
  dark,
  expandable = true,
  expanded = false,
  className,
}: FieldTypeProps) {
  field.resolve();

  const [open, setOpen] = useState(expanded);

  let resolvedType = field.resolvedType;

  const expandableResolved = expandable && !!resolvedType;

  return (
    <span className={className}>
      <span className={dark ? "text-white" : "text-secondary"}>
        {field.map && "map<" + (field as unknown as MapField).keyType + ", "}
        {expandableResolved ? (
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
        {field.map && ">"}
        {field.repeated ? "[]" : ""}
      </span>
      {/*{field.optional ? " (optional)" : ""}*/}
      <div>
        {!!resolvedType && resolvedType instanceof protobuf.Type && open && (
          <Type type={resolvedType} dark={dark} expanded={true} />
        )}
        {!!resolvedType && resolvedType instanceof protobuf.Enum && open && (
          <EnumType enumType={resolvedType} dark={dark} expanded={true} />
        )}
      </div>
    </span>
  );
}
