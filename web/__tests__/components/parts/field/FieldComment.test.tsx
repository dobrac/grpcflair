import { act, render } from "@testing-library/react";
import { type } from "../../../../tests/protobufjs-source";
import FieldComment from "@/components/parts/field/FieldComment";

describe("FieldComment", () => {
  const field = type.fieldsArray[0];

  it("renders - has comment", async () => {
    const rendered = await act(async () => {
      return render(<FieldComment field={field} />);
    });

    const element = rendered.container.firstChild;
    expect(element).toBeInTheDocument();

    if (field.comment) {
      expect(element).toHaveTextContent(field.comment);
    }
  });
  it("renders - does not have a comment", async () => {
    field.comment = null;

    const rendered = await act(async () => {
      return render(<FieldComment field={field} />);
    });

    const element = rendered.container.firstChild;
    expect(element).not.toBeInTheDocument();
  });
});
