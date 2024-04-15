import { act, render, screen } from "@testing-library/react";
import { type } from "../../../../tests/protobufjs-source";
import { getOptionsFromReflectionObject } from "@/services/protobufjs";
import FieldOptions from "@/components/parts/field/FieldOptions";

describe("FieldOptions", () => {
  const field = type.fieldsArray[0];

  const options = Object.entries(getOptionsFromReflectionObject(field));

  it("renders", async () => {
    await act(async () => {
      render(<FieldOptions field={field} />);
    });

    const element = screen.getByTestId(`options-${field.fullName}`);
    expect(element).toBeInTheDocument();

    options.forEach(([key, value]) => {
      expect(element).toHaveTextContent(`${key}: ${JSON.stringify(value)}`);
    });
  });

  it("renders - no options", async () => {
    field.options = [];

    await act(async () => {
      render(<FieldOptions field={field} />);
    });

    const element = screen.queryByTestId(`options-${field.fullName}`);
    expect(element).not.toBeInTheDocument();
  });
});
