import "../../tests/mocks/react-bootstrap";
import { act, render, screen } from "@testing-library/react";
import Endpoints from "@/components/Endpoints";
import { SourceContext } from "@/contexts/SourceContext";
import { DEFAULT_HOSTNAME } from "@/types/constants";
import { context } from "../../tests/protobufjs-source";

describe("Endpoints", () => {
  beforeEach(async () => {
    await act(async () => {
      return render(
        <SourceContext.Provider
          value={{
            hostname: DEFAULT_HOSTNAME,
            setHostname: jest.fn(),
            context: context,
            setContext: jest.fn(),
            error: undefined,
            setError: jest.fn(),
          }}
        >
          <Endpoints />
        </SourceContext.Provider>,
      );
    });
  });

  it("renders services", async () => {
    const services = screen.getByTestId("services");
    expect(services).toBeInTheDocument();
  });

  it("renders types", async () => {
    const services = screen.getByTestId("types");
    expect(services).toBeInTheDocument();
  });

  it("renders enums", async () => {
    const services = screen.getByTestId("enums");
    expect(services).toBeInTheDocument();
  });

  it("collapse services", async () => {
    const services = screen.getByTestId("services");
    expect(services).toBeVisible();

    const button = screen.getByText("Services");
    expect(button).toBeInTheDocument();
    if (!button) {
      throw new Error("Button not found");
    }

    await act(async () => {
      button.click();
    });

    expect(services).not.toBeVisible();
  });

  it("collapse types", async () => {
    const types = screen.getByTestId("types");
    expect(types).toBeVisible();

    const button = screen.getByText("Types");
    expect(button).toBeInTheDocument();
    if (!button) {
      throw new Error("Button not found");
    }

    await act(async () => {
      button.click();
    });

    expect(types).not.toBeVisible();
  });

  it("collapse enums", async () => {
    const enums = screen.getByTestId("enums");
    expect(enums).toBeVisible();

    const button = screen.getByText("Enums");
    expect(button).toBeInTheDocument();
    if (!button) {
      throw new Error("Button not found");
    }

    await act(async () => {
      button.click();
    });

    expect(enums).not.toBeVisible();
  });
});

describe("Endpoints Errors", () => {
  it("renders error", async () => {
    const errorMessage = "Test error";
    const rendered = await act(async () => {
      return render(
        <SourceContext.Provider
          value={{
            hostname: DEFAULT_HOSTNAME,
            setHostname: jest.fn(),
            context: undefined,
            setContext: jest.fn(),
            error: new Error(errorMessage),
            setError: jest.fn(),
          }}
        >
          <Endpoints />
        </SourceContext.Provider>,
      );
    });

    const containerElement = rendered.container.firstChild;
    expect(containerElement).toHaveTextContent(errorMessage);

    const services = rendered.queryByTestId("services");
    expect(services).not.toBeInTheDocument();
  });

  it("renders no context", async () => {
    const rendered = await act(async () => {
      return render(
        <SourceContext.Provider
          value={{
            hostname: DEFAULT_HOSTNAME,
            setHostname: jest.fn(),
            context: undefined,
            setContext: jest.fn(),
            error: undefined,
            setError: jest.fn(),
          }}
        >
          <Endpoints />
        </SourceContext.Provider>,
      );
    });

    const services = rendered.queryByTestId("services");
    expect(services).not.toBeInTheDocument();
  });
});
