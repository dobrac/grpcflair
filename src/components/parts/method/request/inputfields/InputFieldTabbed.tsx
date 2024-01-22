import { Nav } from "react-bootstrap";
import { ReactNode, useState } from "react";

export enum InputTypeTab {
  JSON = "json",
  MODEL = "model",
}

export interface InputFieldTabbedProps {
  renderer: Record<InputTypeTab, ReactNode>;
}

export default function InputFieldTabbed({ renderer }: InputFieldTabbedProps) {
  const [requestInputType, setRequestInputType] = useState<InputTypeTab>(
    InputTypeTab.JSON,
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
        <Nav.Item>
          <Nav.Link eventKey={InputTypeTab.JSON}>JSON</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey={InputTypeTab.MODEL}>Model</Nav.Link>
        </Nav.Item>
      </Nav>
      <div>{renderer[requestInputType]}</div>
    </>
  );
}
