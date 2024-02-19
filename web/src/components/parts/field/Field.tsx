import protobuf from "protobufjs";
import FieldType from "@/components/parts/field/FieldType";
import FieldComment from "@/components/parts/field/FieldComment";
import FieldOptions from "@/components/parts/field/FieldOptions";

export interface FieldProps {
  field: protobuf.Field;
  dark?: boolean;
}

export default function Field({ field, dark }: FieldProps) {
  return (
    <div>
      <div>
        <FieldComment field={field} dark={dark} />
        <FieldOptions field={field} dark={dark} />
      </div>
      <span className="fw-bolder">
        {field.name}
        {field.required ? "*" : ""}
      </span>
      <span className="text-secondary ms-1">({field.id})</span>
      {": "}
      <FieldType field={field} dark={dark} />
    </div>
  );
}
