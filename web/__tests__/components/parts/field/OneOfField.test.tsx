import { act, render, screen } from "@testing-library/react";
import { type } from "../../../../tests/protobufjs-source";
import OneOfField from "@/components/parts/field/OneOfField";

describe("OneOfField", () => {
  const field = type.oneofs["oneoffield"];

  it("renders", async () => {
    await act(async () => {
      render(<OneOfField field={field} />);
    });

    const element = screen.getByTestId(`oneof-${field.fullName}`);
    expect(element).toBeInTheDocument();

    expect(element).toHaveTextContent(field.name);

    if (field.comment) {
      expect(element).toHaveTextContent(field.comment);
    }

    field.fieldsArray.forEach((field) => {
      expect(screen.queryByTestId(`field-${field.id}`)).toBeInTheDocument();
    });
  });
});
