import { act, fireEvent, render, screen } from "@testing-library/react";
import Home from "@/app/page";
import { SourceContext, SourceContextData } from "@/contexts/SourceContext";
import { DEFAULT_HOSTNAME } from "@/types/constants";
import { context } from "../../tests/protobufjs-source";

describe("Page", () => {
  it("renders a default heading", async () => {
    await act(async () => {
      render(<Home />);
    });

    const heading = screen.getByRole("heading", {
      name: "gRPCFlair",
    });

    expect(heading).toBeInTheDocument();
  });

  it("opens metadata dialog", async () => {
    await act(async () => {
      render(<Home />);
    });

    const metadataButton = screen.getByTestId("metadata-button");
    expect(metadataButton).toBeInTheDocument();

    await act(async () => {
      metadataButton.click();
    });

    expect(screen.queryByTestId("metadata-modal")).toBeInTheDocument();
  });

  it("change the base gRPC url", async () => {
    const newHostname = "myownurl:50051";

    const sourceContext: SourceContextData = {
      hostname: DEFAULT_HOSTNAME,
      setHostname: jest.fn((hostname: string) => {
        sourceContext.hostname = hostname;
      }),
      context: context,
      setContext: jest.fn(),
      error: undefined,
      setError: jest.fn(),
    };

    const { rerender } = await act(async () => {
      return render(
        <SourceContext.Provider value={sourceContext}>
          <Home />
        </SourceContext.Provider>,
      );
    });

    const hostnameInput = screen.getByTestId("hostname-input");
    expect(hostnameInput).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(hostnameInput, { target: { value: newHostname } });
    });

    await act(async () => {
      rerender(
        <SourceContext.Provider value={sourceContext}>
          <Home />
        </SourceContext.Provider>,
      );
    });

    const hostnameInputAfter = screen.getByTestId("hostname-input");
    expect(hostnameInputAfter).toHaveValue(newHostname);
  });

  it("close metadata dialog", async () => {
    await act(async () => {
      render(<Home />);
    });

    const metadataButton = screen.getByTestId("metadata-button");
    expect(metadataButton).toBeInTheDocument();

    await act(async () => {
      metadataButton.click();
    });

    const modal = screen.queryByTestId("metadata-modal");
    expect(modal).toBeInTheDocument();

    const closeButton = screen.getByLabelText("Close");
    await act(async () => {
      closeButton.click();
    });

    const modalAfter = screen.queryByTestId("metadata-modal");
    expect(modalAfter).not.toBeInTheDocument();
  });
});
