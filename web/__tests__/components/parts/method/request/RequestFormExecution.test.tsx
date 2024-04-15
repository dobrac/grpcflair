import "../../../../../tests/mocks/grpc-web";
import { act, render } from "@testing-library/react";
import MethodContextProvider from "@/contexts/MethodContext";
import { context } from "../../../../../tests/protobufjs-source";
import RequestFormExecution from "@/components/parts/method/request/RequestFormExecution";

describe("RequestFormExecution", () => {
  const service = context.lookupService("helloworld.Greeter");
  service.resolve();

  const method = service.methods["TestInputTypes"];
  method.resolve();

  it("renders", async () => {
    const method = service.methods["SayHello"];
    method.resolve();

    const renderedElement = await act(async () => {
      return render(
        <MethodContextProvider method={method}>
          <RequestFormExecution service={service} method={method} />
        </MethodContextProvider>,
      );
    });

    const element = await renderedElement.findByTestId("method-execute-button");
    expect(element).toBeInTheDocument();

    await act(async () => {
      element.click();
    });

    expect(
      renderedElement.queryByTestId("method-execute-button"),
    ).toBeInTheDocument();
    expect(
      renderedElement.queryByTestId("method-cancel-button"),
    ).not.toBeInTheDocument();
  });
});
