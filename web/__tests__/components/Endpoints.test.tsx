import { act, render, screen } from "@testing-library/react";
import Endpoints from "@/components/Endpoints";
import { SourceContext } from "@/contexts/SourceContext";
import { DEFAULT_HOSTNAME } from "@/types/constants";
import { context } from "../../tests/protobufjs-source";

const COLLAPSE_TIMEOUT = 2000;

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

    const button = services.querySelector("button");
    expect(button).toBeInTheDocument();
    if (!button) {
      throw new Error("Button not found");
    }

    const detailsVisible = screen.queryAllByTestId("service-detail");
    detailsVisible.forEach((detail) => {
      expect(detail).toBeVisible();
    });

    await act(async () => {
      button.click();
    });

    new Promise((resolve) => {
      setTimeout(() => {
        const detailsHidden = screen.queryAllByTestId("service-detail");
        detailsHidden.forEach((detail) => {
          expect(detail).not.toBeVisible();
        });
        resolve(undefined);
      }, COLLAPSE_TIMEOUT);
    });
  });

  it("collapse types", async () => {
    const services = screen.getByTestId("types");

    const button = services.querySelector("button");
    expect(button).toBeInTheDocument();
    if (!button) {
      throw new Error("Button not found");
    }

    const detailsVisible = screen.queryAllByTestId("type-detail");
    detailsVisible.forEach((detail) => {
      expect(detail).toBeVisible();
    });

    await act(async () => {
      button.click();
    });

    new Promise((resolve) => {
      setTimeout(() => {
        const detailsHidden = screen.queryAllByTestId("type-detail");
        detailsHidden.forEach((detail) => {
          expect(detail).not.toBeVisible();
        });
        resolve(undefined);
      }, COLLAPSE_TIMEOUT);
    });
  });

  it("collapse enums", async () => {
    const services = screen.getByTestId("enums");

    const button = services.querySelector("button");
    expect(button).toBeInTheDocument();
    if (!button) {
      throw new Error("Button not found");
    }

    const detailsVisible = screen.queryAllByTestId("enum-detail");
    detailsVisible.forEach((detail) => {
      expect(detail).toBeVisible();
    });

    await act(async () => {
      button.click();
    });

    new Promise((resolve) => {
      setTimeout(() => {
        const detailsHidden = screen.queryAllByTestId("enum-detail");
        detailsHidden.forEach((detail) => {
          expect(detail).not.toBeVisible();
        });
        resolve(undefined);
      }, COLLAPSE_TIMEOUT);
    });
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
