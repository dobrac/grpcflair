import protobuf from "protobufjs";
import FieldType from "@/components/parts/field/FieldType";
import FieldOptions from "@/components/parts/field/FieldOptions";

export interface InputFieldNameProps {
  field: protobuf.Field | protobuf.OneOf;
}

export default function InputFieldName({ field }: InputFieldNameProps) {
  field.resolve();

  return (
    <div>
      <div className="fw-bolder">{field.name}</div>
      {field instanceof protobuf.Field && (
        <FieldType field={field} expandable={false} />
      )}
      <FieldOptions field={field} />
    </div>
  );
}
