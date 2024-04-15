import { act, fireEvent, render } from "@testing-library/react";
import FormatSelector from "@/components/parts/method/request/FormatSelector";
import MethodContextProvider from "@/contexts/MethodContext";
import { context } from "../../../../../tests/protobufjs-source";
import { GrpcWebFormat } from "@/types/grpc-web";

describe("FormatSelector", () => {
  const service = context.lookupService("helloworld.Greeter");
  service.resolve();

  const method = service.methods["TestInputTypes"];
  method.resolve();

  it("renders", async () => {
    const renderedElement = await act(async () => {
      return render(
        <MethodContextProvider method={method}>
          <FormatSelector />
        </MethodContextProvider>,
      );
    });

    const element = renderedElement.container.firstChild;
    expect(element).toBeInTheDocument();

    if (!element) {
      return;
    }

    Object.values(GrpcWebFormat).forEach((format) => {
      const option = renderedElement.container.querySelector(
        `option[value="${format}"]`,
      );

      expect(option).toBeInTheDocument();
    });
  });

  it("change values", async () => {
    const renderedElement = await act(async () => {
      return render(
        <MethodContextProvider method={method}>
          <FormatSelector />
        </MethodContextProvider>,
      );
    });

    const element = renderedElement.container.firstChild;
    expect(element).toBeInTheDocument();
    if (!element) {
      return;
    }

    const select = renderedElement.container.querySelector("select");
    expect(select).toBeInTheDocument();
    if (!select) {
      return;
    }

    await act(async () => {
      fireEvent.change(select, { target: { value: GrpcWebFormat.BINARY } });
    });
    expect(select).toHaveValue(GrpcWebFormat.BINARY);

    await act(async () => {
      fireEvent.change(select, { target: { value: GrpcWebFormat.TEXT } });
    });
    expect(select).toHaveValue(GrpcWebFormat.TEXT);
  });
});
