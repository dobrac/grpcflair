import { Form } from "react-bootstrap";
import protobuf from "protobufjs";

export interface InputFieldProps {
  field: protobuf.Field;
  value?: any;
  onChange?: (value: unknown) => void;
}

export default function InputField({
  field,
  value,
  onChange,
}: InputFieldProps) {
  field.resolve();

  const resolvedType = field.resolvedType;

  return (
    <div>
      <div>
        <div>
          <span className="fw-bolder">{field.name}</span>
          <span className="ms-1 text-secondary fst-italic">
            {field.comment}
          </span>
        </div>
        <div>
          <span className="text-secondary">{field.type.toString()}</span>
        </div>
      </div>
      {!!resolvedType && field.resolvedType instanceof protobuf.Type && (
        <div className="d-grid gap-2">
          {Object.values(field.resolvedType.fields).map((field) => (
            <div key={field.name} className="ms-3 card p-2">
              <InputField
                field={field}
                value={value[field.name]}
                onChange={(fieldValue) => {
                  onChange?.({
                    ...value,
                    [field.name]: fieldValue,
                  });
                }}
              />
            </div>
          ))}
        </div>
      )}
      {!resolvedType && (
        <Form.Control
          as="input"
          placeholder={field.defaultValue ?? field.typeDefault}
          key={value}
          defaultValue={value ?? field.defaultValue ?? field.typeDefault}
          onBlur={(e) => {
            if (typeof field.typeDefault === "number") {
              onChange?.(Number(e.target.value));
            } else if (typeof field.typeDefault === "boolean") {
              onChange?.(e.target.value === "true");
            } else if (typeof field.typeDefault === "string") {
              onChange?.(e.target.value);
            } else {
              onChange?.(e.target.value);
            }
          }}
        />
      )}
    </div>
  );
}
