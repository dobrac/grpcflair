import protobuf from "protobufjs";

export interface InputFieldNameProps {
  field: protobuf.Field;
}

export default function InputFieldName({ field }: InputFieldNameProps) {
  field.resolve();

  return (
    <div>
      <div className="fw-bolder">{field.name}</div>
      <div className="text-secondary small">{field.type.toString()}</div>
    </div>
  );
}
