import { Form, Nav } from "react-bootstrap";
import protobuf from "protobufjs";
import { useState } from "react";
import Type from "@/components/parts/Type";
import EnumType from "@/components/parts/EnumType";
import FieldType from "@/components/parts/field/FieldType";
import { isJSON } from "@/services/json";
import { getFieldDefaultValue } from "@/services/protobufjs";

function ScalarInputField({ field, value, onChange }: InputFieldValueProps) {
  if (field.type === "bytes") {
    return (
      <Form.Control
        type="file"
        defaultValue={value}
        onBlur={(e) => {
          onChange?.(e.target.value);
        }}
      />
    );
  }

  if (typeof field.typeDefault === "boolean") {
    return (
      <Form.Select
        value={value}
        onChange={(e) => {
          if (e.target.value !== "") {
            onChange?.(e.target.value === "true");
          } else {
            onChange?.(undefined);
          }
        }}
      >
        <option value=""></option>
        <option value="true">true</option>
        <option value="false">false</option>
      </Form.Select>
    );
  }

  if (typeof field.typeDefault === "number") {
    return (
      <Form.Control
        as="input"
        type="number"
        defaultValue={value}
        onBlur={(e) => {
          if (e.target.value !== "") {
            onChange?.(Number(e.target.value));
          } else {
            onChange?.(undefined);
          }
        }}
      />
    );
  }

  return (
    <Form.Control
      as="input"
      defaultValue={value}
      onBlur={(e) => {
        if (e.target.value !== "") {
          onChange?.(e.target.value);
        } else {
          onChange?.(undefined);
        }
      }}
    />
  );
}

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

  const dataPlaceholder = getFieldDefaultValue(field);

  if (field.repeated) {
    return (
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
            rows={5}
            defaultValue={JSON.stringify(value, null, 2)}
            placeholder={JSON.stringify([dataPlaceholder], null, 2)}
            onBlur={(e) => {
              const targetValue = e.target.value;
              if (!isJSON(targetValue)) {
                onChange?.(value);
                return;
              }

              const parsedValue = JSON.parse(targetValue);
              if (!Array.isArray(parsedValue)) {
                onChange?.(undefined);
                return;
              }

              onChange?.(parsedValue);
            }}
          />
        </div>
        <div
          className={
            requestInputType === InputTypeTab.MODEL ? "d-block" : "d-none"
          }
        >
          <div className="card px-2 py-1 d-inline-block">
            <FieldType field={field} expanded={true} />
          </div>
        </div>
      </>
    );
  }

  if (field.map) {
    return (
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
          <div className="card px-2 py-1 d-inline-block">
            <FieldType field={field} expanded={true} />
          </div>
        </div>
      </>
    );
  }

  // TODO: Well Known Types?
  // if (field.type === "google.protobuf.Timestamp") {
  //   return (
  //     <Form.Control
  //       type="datetime-local"
  //       defaultValue={value}
  //       onBlur={(e) => {
  //         onChange?.(e.target.value);
  //       }}
  //     />
  //   );
  // }
  // if (field.type === "google.protobuf.Any") {
  //   return (
  //     <Form.Control
  //       as="textarea"
  //       placeholder={field.defaultValue ?? field.typeDefault}
  //       rows={10}
  //       onBlur={(e) => {
  //         const value = e.target.value;
  //         if (isJSON(value)) {
  //           onChange?.(JSON.parse(value));
  //         } else {
  //           onChange?.(value);
  //         }
  //       }}
  //     />
  //   );
  // }

  if (!resolvedType) {
    return (
      <div>
        <ScalarInputField field={field} value={value} onChange={onChange} />
      </div>
    );
  }

  if (resolvedType instanceof protobuf.Type) {
    return (
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
          <Type type={resolvedType} expanded={true} />
        </div>
      </>
    );
  }

  if (resolvedType instanceof protobuf.Enum) {
    return (
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
            <Nav.Link eventKey={InputTypeTab.JSON}>Selector</Nav.Link>
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
          <Form.Select
            value={value}
            onChange={(e) => {
              if (e.target.value !== "") {
                onChange?.(e.target.value);
              } else {
                onChange?.(undefined);
              }
            }}
          >
            <option value=""></option>
            {Object.entries(resolvedType.values).map(([key, value]) => (
              <option key={`${key}-${value}`} value={key}>
                {key} ({value})
              </option>
            ))}
          </Form.Select>
        </div>
        <div
          className={
            requestInputType === InputTypeTab.MODEL ? "d-block" : "d-none"
          }
        >
          <EnumType enumType={resolvedType} expanded={true} />
        </div>
      </>
    );
  }

  return null;
}
