import { act, render, screen } from "@testing-library/react";
import { context } from "../../../tests/protobufjs-source";
import Type from "@/components/parts/Type";

describe("Type", () => {
  const type = context.lookupType("helloworld.TestRequest");
  type.resolve();

  it("renders - collapsed", async () => {
    await act(async () => {
      render(<Type type={type} expanded={false} />);
    });

    const element = screen.getByTestId("type-detail");
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent(type.fullName);

    if (type.comment) {
      expect(element).toHaveTextContent(type.comment);
    }

    expect(
      screen.queryByTestId("options-" + type.fullName),
    ).not.toBeInTheDocument();
  });

  it("renders - expanded", async () => {
    await act(async () => {
      render(<Type type={type} expanded={true} />);
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

    type.oneofsArray.forEach((oneof) => {
      expect(
        screen.queryByTestId("oneof-" + oneof.fullName),
      ).toBeInTheDocument();
    });

    type.fieldsArray
      .filter((it) => !it.partOf)
      .forEach((field) => {
        expect(screen.queryByTestId("field-" + field.id)).toBeInTheDocument();
      });
  });

  it("renders - light", async () => {
    await act(async () => {
      render(<Type type={type} dark={false} />);
    });

    const element = screen.getByTestId("type-detail");
    expect(element).toBeInTheDocument();

    expect(element).not.toHaveClass("bg-dark text-light");
  });

  it("renders - dark", async () => {
    await act(async () => {
      render(<Type type={type} dark={true} />);
    });

    const element = screen.getByTestId("type-detail");
    expect(element).toBeInTheDocument();

    expect(element).toHaveClass("bg-dark text-light");
  });
});
