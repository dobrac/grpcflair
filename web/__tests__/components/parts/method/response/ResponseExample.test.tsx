import { act, render, screen } from "@testing-library/react";
import ResponseExample from "@/components/parts/method/response/ResponseExample";
import { context } from "../../../../../tests/protobufjs-source";

describe("ResponseExample", () => {
  const type = context.lookupType("helloworld.TestRequest");
  type.resolve();

  it("renders", async () => {
    await act(async () => {
      render(<ResponseExample responseType={type} />);
    });

    const element = screen.getByTestId("type-detail");
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent(type.fullName);

    if (type.comment) {
      expect(element).toHaveTextContent(type.comment);
    }

    expect(
      screen.queryByTestId("options-" + type.fullName),
    ).toBeInTheDocument();
  });

  it("renders - no type", async () => {
    const renderedElement = await act(async () => {
      return render(<ResponseExample responseType={null} />);
    });

    const element = renderedElement.container.firstChild;
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent("No response type");
  });
});
