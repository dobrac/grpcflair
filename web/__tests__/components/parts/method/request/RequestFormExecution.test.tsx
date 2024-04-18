import "../../../../../tests/mocks/grpc-web";
import "../../../../../tests/mocks/react-hook-form";
import { act, render } from "@testing-library/react";
import MethodContextProvider, {
  MethodContextData,
  MethodRequest,
  MethodResponse,
  SourceContext,
} from "@/contexts/MethodContext";
import { context } from "../../../../../tests/protobufjs-source";
import RequestFormExecution from "@/components/parts/method/request/RequestFormExecution";
import { GrpcWebMockMetadataResultError } from "../../../../../tests/mocks/grpc-web";
import { GrpcWebFormat } from "@/types/grpc-web";
import {
  MetadataContext,
  MetadataContextData,
} from "@/contexts/MetadataContext";
import { mockFormContext } from "../../../../../tests/mocks/react-hook-form";

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

  it("renders - execution - error", async () => {
    const method = service.methods["SayHello"];
    method.resolve();

    let request: MethodRequest = {
      format: GrpcWebFormat.TEXT,
    };
    let response: MethodResponse | undefined;

    const contextData: MethodContextData = {
      processing: false,
      request,
      response,
      functions: {
        setRequest: (it) => {
          if (typeof it === "function") {
            request = it(request);
          } else {
            request = it;
          }
          return request;
        },
        setResponse: (it) => {
          if (typeof it === "function") {
            response = it(response);
          } else {
            response = it;
          }
          return response;
        },
        setCancelFunction: jest.fn(),
      },
    };

    const contextMetadata: MetadataContextData = {
      metadata: {
        expectedResult: GrpcWebMockMetadataResultError,
      },
      setMetadata: jest.fn(),
    };

    const renderedElement = await act(async () => {
      return render(
        <MethodContextProvider method={method}>
          <MetadataContext.Provider value={contextMetadata}>
            <SourceContext.Provider value={contextData}>
              <RequestFormExecution service={service} method={method} />
            </SourceContext.Provider>
          </MetadataContext.Provider>
        </MethodContextProvider>,
      );
    });

    const element = await renderedElement.findByTestId("method-execute-button");
    expect(element).toBeInTheDocument();

    const consoleError = jest.fn();
    console.error = consoleError;
    await act(async () => {
      element.click();
    });

    expect(response?.error).toBeDefined();
    expect(consoleError).toHaveBeenCalled();
  });

  it("renders - execution - cancel", async () => {
    const method = service.methods["SayHello"];
    method.resolve();

    const cancelFunction = jest.fn();

    const contextData: MethodContextData = {
      processing: true,
      request: {
        format: GrpcWebFormat.TEXT,
      },
      functions: {
        setRequest: jest.fn(),
        setResponse: jest.fn(),
        cancel: cancelFunction,
        setCancelFunction: jest.fn(),
      },
    };

    const renderedElement = await act(async () => {
      return render(
        <MethodContextProvider method={method}>
          <SourceContext.Provider value={contextData}>
            <RequestFormExecution service={service} method={method} />
          </SourceContext.Provider>
        </MethodContextProvider>,
      );
    });

    const cancelButton = await renderedElement.findByTestId(
      "method-cancel-button",
    );
    expect(cancelButton).toBeInTheDocument();

    await act(async () => {
      cancelButton.click();
    });

    expect(cancelFunction).toHaveBeenCalled();
  });

  it("renders - execution - validation error", async () => {
    const method = service.methods["SayHello"];
    method.resolve();

    const VALIDATION_ERROR = "Error has occurred";

    // Mock requestType verify error
    if (!method.resolvedRequestType) {
      throw new Error("Request type not resolved");
    }
    method.resolvedRequestType.verify = jest.fn(() => {
      return VALIDATION_ERROR;
    });

    const contextData: MethodContextData = {
      processing: false,
      request: {
        format: GrpcWebFormat.TEXT,
      },
      functions: {
        setRequest: jest.fn(),
        setResponse: jest.fn(),
        setCancelFunction: jest.fn(),
      },
    };

    const renderedElement = await act(async () => {
      return render(
        <MethodContextProvider method={method}>
          <SourceContext.Provider value={contextData}>
            <RequestFormExecution service={service} method={method} />
          </SourceContext.Provider>
        </MethodContextProvider>,
      );
    });

    const element = await renderedElement.findByTestId("method-execute-button");
    expect(element).toBeInTheDocument();

    await act(async () => {
      element.click();
    });

    expect(mockFormContext.setError).toHaveBeenCalled();
    expect(mockFormContext.setError).toHaveBeenCalledWith(VALIDATION_ERROR, {
      type: "manual",
      message: expect.any(String),
    });
  });
});
