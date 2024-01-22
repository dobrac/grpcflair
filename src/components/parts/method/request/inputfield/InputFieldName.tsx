import protobuf from "protobufjs";
import FieldType from "@/components/parts/field/FieldType";

export interface InputFieldNameProps {
  field: protobuf.Field;
}

export default function InputFieldName({ field }: InputFieldNameProps) {
  field.resolve();

  return (
    <div>
      <div className="fw-bolder">{field.name}</div>
      <FieldType field={field} expandable={false} />
    </div>
  );
}
