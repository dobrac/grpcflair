import protobuf from "protobufjs";
import FieldType from "@/components/parts/field/FieldType";
import FieldComment from "@/components/parts/field/FieldComment";

export interface FieldProps {
  field: protobuf.Field;
  dark?: boolean;
}

export default function Field({ field, dark }: FieldProps) {
  return (
    <div>
      <div>
        <FieldComment field={field} dark={dark} />
      </div>
      <span className="fw-bolder">
        {field.name}
        {field.required ? "*" : ""}
      </span>
      {": "}
      <FieldType field={field} dark={dark} />
    </div>
  );
}
