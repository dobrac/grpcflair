import { act, render, screen } from "@testing-library/react";
import EnumType from "@/components/parts/EnumType";
import { context } from "../../../tests/protobufjs-source";

describe("EnumType", () => {
  const enumType = context.lookupEnum(".helloworld.Corpus");
  enumType.resolve();

  it("renders - collapsed", async () => {
    await act(async () => {
      render(<EnumType enumType={enumType} expanded={false} />);
    });

    const element = screen.getByTestId("enum");
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent("[Enum]");
    expect(element).toHaveTextContent(enumType.fullName);

    const value = screen.queryByTestId("enum-value-" + enumType.valuesById[0]);
    expect(value).not.toBeInTheDocument();

    if (enumType.comment) {
      expect(element).toHaveTextContent(enumType.comment);
    }
  });
  it("renders - expanded", async () => {
    await act(async () => {
      render(<EnumType enumType={enumType} expanded={true} />);
    });

    const element = screen.getByTestId("enum");
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent("[Enum]");
    expect(element).toHaveTextContent(enumType.fullName);

    Object.entries(enumType.values).forEach(([key, value]) => {
      const valueElement = screen.queryByTestId("enum-value-" + key);
      expect(valueElement).toBeInTheDocument();
      expect(valueElement).toHaveTextContent(key);
      expect(valueElement).toHaveTextContent(value.toString());
    });

    if (enumType.comment) {
      expect(element).toHaveTextContent(enumType.comment);
    }
  });

  it("renders - dark", async () => {
    await act(async () => {
      render(<EnumType enumType={enumType} dark={true} />);
    });

    const element = screen.getByTestId("enum");
    expect(element).toBeInTheDocument();
    expect(element.querySelector("button")).toHaveClass("text-light");
  });

  it("renders - light", async () => {
    await act(async () => {
      render(<EnumType enumType={enumType} dark={false} />);
    });

    const element = screen.getByTestId("enum");
    expect(element).toBeInTheDocument();
    expect(element.querySelector("button")).not.toHaveClass("text-light");
  });
});
