import { ReactNode } from "react";

jest.mock("react-bootstrap", () => {
  const Collapse = (props: { in: boolean; children: ReactNode }) => {
    return (
      <div style={{ display: props.in ? "block" : "none" }}>
        {props.children}
      </div>
    );
  };
  return {
    ...jest.requireActual("react-bootstrap"),
    Collapse,
  };
});
