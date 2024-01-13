import protobuf from "protobufjs";
import Field from "@/components/Field";

export interface TypeProps {
  type: protobuf.Type;
}

export default function Type({ type }: TypeProps) {
  return (
    <div className="card px-2 py-1">
      <div>
        <span className="fw-bolder">{type.name}</span>
        {" {"}
      </div>
      <div className="ps-3">
        {Object.values(type.fields).map((field) => (
          <Field key={field.name} field={field} />
        ))}
      </div>
      <div>{"}"}</div>
    </div>
  );
}
