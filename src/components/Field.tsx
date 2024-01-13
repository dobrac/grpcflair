import protobuf from "protobufjs";

export interface FieldProps {
  field: protobuf.Field;
}

export default function Field({ field }: FieldProps) {
  return (
    <div>
      <span className="fw-bolder">
        {field.name}
        {field.required ? "*" : ""}
      </span>
      {": "}
      <span className="text-secondary">{field.type}</span>
      {field.repeated ? "[]" : ""}
      {field.map ? "<string, string>" : ""}
      {field.optional ? " (optional)" : ""}
      {field.comment && (
        <span className="text-secondary fst-italic ms-1">{field.comment}</span>
      )}
    </div>
  );
}
