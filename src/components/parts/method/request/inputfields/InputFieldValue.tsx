import { Form, Nav } from "react-bootstrap";
import protobuf from "protobufjs";
import { useState } from "react";
import Type from "@/components/parts/Type";

enum InputTypeTab {
  JSON = "json",
  MODEL = "model",
}

export interface InputFieldValueProps {
  field: protobuf.Field;
  value?: any;
  onChange?: (value: unknown) => void;
}

export default function InputFieldValue({
  field,
  value,
  onChange,
}: InputFieldValueProps) {
  field.resolve();

  const resolvedType = field.resolvedType;

  const [requestInputType, setRequestInputType] = useState<InputTypeTab>(
    InputTypeTab.JSON,
  );

  return (
    <div>
      {!!resolvedType && field.resolvedType instanceof protobuf.Type && (
        <>
          <Nav
            variant="underline"
            className="mb-2 small"
            activeKey={requestInputType}
            onSelect={(selectedKey) => {
              setRequestInputType(selectedKey as unknown as InputTypeTab);
            }}
          >
            <Nav.Item>
              <Nav.Link eventKey={InputTypeTab.JSON}>JSON</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey={InputTypeTab.MODEL}>Model</Nav.Link>
            </Nav.Item>
          </Nav>
          <div
            className={
              requestInputType === InputTypeTab.JSON ? "d-block" : "d-none"
            }
          >
            <Form.Control
              key={JSON.stringify(value)}
              as="textarea"
              rows={10}
              defaultValue={JSON.stringify(value, null, 2)}
              onBlur={(e) => {
                const fieldValue = e.target.value
                  ? JSON.parse(e.target.value)
                  : {};
                onChange?.(fieldValue);
              }}
            />
          </div>
          <div
            className={
              requestInputType === InputTypeTab.MODEL ? "d-block" : "d-none"
            }
          >
            <Type type={field.resolvedType} expanded={true} />
          </div>
        </>
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
