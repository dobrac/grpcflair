import protobuf from "protobufjs";
import FieldType from "@/components/parts/field/FieldType";
import FieldComment from "@/components/parts/field/FieldComment";
import FieldOptions from "@/components/parts/field/FieldOptions";
import Field from "@/components/parts/field/Field";

export interface FieldProps {
  field: protobuf.OneOf;
  dark?: boolean;
}

export default function OneOfField({ field, dark }: FieldProps) {
  return (
    <div data-testid={"oneof-" + field.fullName}>
      <div>
        <FieldComment field={field} dark={dark} />
        <FieldOptions field={field} dark={dark} />
      </div>
      oneof <span className="fw-bolder">{field.name}</span>
      {" {"}
      <div className="ps-3">
        {field.fieldsArray.map((field) => (
          <Field key={field.name} field={field} dark={dark} />
        ))}
      </div>
      {"}"}
    </div>
  );
}
