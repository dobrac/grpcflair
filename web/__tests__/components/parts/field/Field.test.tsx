import { act, render, screen } from "@testing-library/react";
import { type } from "../../../../tests/protobufjs-source";
import Field from "@/components/parts/field/Field";

describe("Field", () => {
  const field = type.fieldsArray[0];

  it("renders", async () => {
    await act(async () => {
      render(<Field field={field} />);
    });

    const element = screen.getByTestId(`field-${field.id}`);
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent(field.name);

    if (field.comment) {
      expect(element).toHaveTextContent(field.comment);
    }

    expect(element).toHaveTextContent(field.type);
    expect(element).toHaveTextContent(field.id.toString());

    expect(element).not.toHaveTextContent("*");
  });
  it("renders - required", async () => {
    field.required = true;

    await act(async () => {
      render(<Field field={field} />);
    });

    const element = screen.getByTestId(`field-${field.id}`);
    expect(element).toBeInTheDocument();

    expect(element).toHaveTextContent("*");
  });
});
