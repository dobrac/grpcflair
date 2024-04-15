import "../../../../tests/mocks/grpc-web";
import { act, render } from "@testing-library/react";
import { context } from "../../../../tests/protobufjs-source";
import Method from "@/components/parts/method/Method";
import MethodContextProvider from "@/contexts/MethodContext";
import { DEFAULT_HOSTNAME } from "@/types/constants";
import {
  grpcWebMockHeaders,
  grpcWebMockResponseData,
  grpcWebMockTrailers,
} from "../../../../tests/mocks/grpc-web";

describe("Method", () => {
  const service = context.lookupService("helloworld.Greeter");
  service.resolve();

  const method = service.methods["TestInputTypes"];
  method.resolve();

  it("renders - collapsed", async () => {
    const renderedElement = await act(async () => {
      return render(
        <MethodContextProvider method={method}>
          <Method service={service} method={method} expanded={false} />
        </MethodContextProvider>,
      );
    });

    const element = renderedElement.container.firstChild;
    expect(element).toBeInTheDocument();

    expect(element).toHaveTextContent(method.name);

    if (method.comment) {
      expect(element).toHaveTextContent(method.comment);
    }
  });

  it("renders - expanded", async () => {
    const renderedElement = await act(async () => {
      return render(
        <MethodContextProvider method={method}>
          <Method service={service} method={method} expanded={true} />
        </MethodContextProvider>,
      );
    });

    const element = renderedElement.container.firstChild;
    expect(element).toBeInTheDocument();

    method.resolvedRequestType?.fieldsArray?.forEach((field) => {
      expect(element).toHaveTextContent(field.name);
    });
  });

  it("renders - execution", async () => {
    const method = service.methods["SayHello"];
    method.resolve();

    const renderedElement = await act(async () => {
      return render(
        <MethodContextProvider method={method}>
          <Method service={service} method={method} expanded={false} />
        </MethodContextProvider>,
      );
    });

    const element = await renderedElement.findByTestId("method-execute-button");
    expect(element).toBeInTheDocument();

    await act(async () => {
      element.click();
    });

    const responseRequestData = await renderedElement.findByTestId(
      "response-request-data",
    );
    expect(responseRequestData).toMatchSnapshot();

    const responseRequestHostname = await renderedElement.findByTestId(
      "response-request-hostname",
    );
    expect(responseRequestHostname).toHaveTextContent(DEFAULT_HOSTNAME);

    const responseResponses =
      await renderedElement.findByTestId("response-responses");
    expect(responseResponses).toHaveTextContent(grpcWebMockHeaders.header);
    expect(responseResponses).toHaveTextContent(
      grpcWebMockResponseData.message,
    );
    expect(responseResponses).toHaveTextContent(grpcWebMockTrailers.trailer);
  });
});
