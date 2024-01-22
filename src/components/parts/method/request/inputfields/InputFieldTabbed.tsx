import { Nav } from "react-bootstrap";
import { ReactNode, useState } from "react";

export enum InputTypeTab {
  JSON = "JSON",
  ENUM = "Selector",
  MODEL = "Model",
}

export interface InputFieldTabbedProps {
  renderer: Partial<Record<InputTypeTab, ReactNode>>;
}

export default function InputFieldTabbed({ renderer }: InputFieldTabbedProps) {
  const availableTypes = Object.values(InputTypeTab).filter(
    (it) => renderer[it],
  );

  const [requestInputType, setRequestInputType] = useState<InputTypeTab>(
    availableTypes[0],
  );

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
        {availableTypes.map((inputType) => (
          <Nav.Item key={inputType}>
            <Nav.Link eventKey={inputType}>{inputType}</Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      <div>{renderer[requestInputType]}</div>
    </>
  );
}
