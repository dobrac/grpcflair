import { act, render } from "@testing-library/react";
import MethodContextProvider from "@/contexts/MethodContext";
import { context } from "../../../../../tests/protobufjs-source";
import RequestForm from "@/components/parts/method/request/RequestForm";

describe("RequestForm", () => {
  const service = context.lookupService("helloworld.Greeter");
  service.resolve();

  const method = service.methods["TestInputTypes"];
  method.resolve();

  const requestType = method.resolvedRequestType!;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders", async () => {
    const renderedElement = await act(async () => {
      return render(
        <MethodContextProvider method={method}>
          <RequestForm method={method} />
        </MethodContextProvider>,
      );
    });

    const element = renderedElement.container.firstChild;
    expect(element).toBeInTheDocument();
    if (!element) {
      return;
    }

    expect(element).toHaveTextContent("Name");
    expect(element).toHaveTextContent("Description");

    requestType.oneofsArray.forEach((oneOf) => {
      expect(element).toHaveTextContent(oneOf.name);
      oneOf.fieldsArray.forEach((field) => {
        expect(element).toHaveTextContent(field.name);
      });
    });

    requestType.fieldsArray.forEach((field) => {
      expect(element).toHaveTextContent(field.name);
    });
  });

  it("no requestType", async () => {
    // Reset the resolvedRequestType to null
    method.resolvedRequestType = null;
    method.resolve = jest.fn();

    const renderedElement = await act(async () => {
      return render(
        <MethodContextProvider method={method}>
          <RequestForm method={method} />
        </MethodContextProvider>,
      );
    });

    const element = renderedElement.container.firstChild;
    expect(element).toBeInTheDocument();
    if (!element) {
      return;
    }

    const tableBody = renderedElement.getByTestId("request-form-table-body");
    expect(tableBody).toBeEmptyDOMElement();
  });
});
