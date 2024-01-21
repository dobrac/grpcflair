import protobuf, { MapField } from "protobufjs";
import Type from "@/components/parts/Type";
import { useState } from "react";
import { Button } from "react-bootstrap";
import EnumType from "@/components/parts/EnumType";
import FieldComment from "@/components/parts/field/FieldComment";

export interface FieldTypeProps {
  field: protobuf.Field;
  dark?: boolean;
  expanded?: boolean;
}

export default function FieldType({
  field,
  dark,
  expanded = false,
}: FieldTypeProps) {
  field.resolve();

  const [open, setOpen] = useState(expanded);

  let resolvedType = field.resolvedType;

  const expandable = !!resolvedType;

  return (
    <>
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
      <div>
        {!!resolvedType && resolvedType instanceof protobuf.Type && open && (
          <Type type={resolvedType} dark={dark} expanded={true} />
        )}
        {!!resolvedType && resolvedType instanceof protobuf.Enum && open && (
          <EnumType enumType={resolvedType} dark={dark} expanded={true} />
        )}
      </div>
    </>
  );
}
