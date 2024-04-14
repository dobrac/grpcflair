import { act, fireEvent, render, screen } from "@testing-library/react";
import { context } from "../../../tests/protobufjs-source";
import MetadataModal from "@/components/metadata/MetadataModal";
import {
  Metadata,
  MetadataContext,
  MetadataContextData,
} from "@/contexts/MetadataContext";
import { AUTHORIZATION_METADATA_KEY } from "@/types/constants";

describe("Metadata", () => {
  const service = context.lookupService("helloworld.Greeter");
  service.resolve();

  it("renders", async () => {
    await act(async () => {
      render(<MetadataModal show={true} onHide={() => {}} />);
    });

    const element = screen.getByTestId("metadata-modal");
    expect(element).toBeInTheDocument();

    expect(element).toHaveTextContent("Metadata");
    expect(element).toHaveTextContent("Authorization");
  });

  it("renders - show metadata", async () => {
    const contextMetadata: MetadataContextData = {
      metadata: {
        MKey: "MValue",
        MYek: "MEulav",
      },
      setMetadata: () => {},
    };

    await act(async () => {
      render(
        <MetadataContext.Provider value={contextMetadata}>
          <MetadataModal show={true} onHide={() => {}} />
        </MetadataContext.Provider>,
      );
    });

    const element = screen.getByTestId("metadata-modal");
    expect(element).toBeInTheDocument();

    Object.entries(contextMetadata.metadata).forEach(([key, value]) => {
      expect(screen.queryByTestId(`metadata-key-${key}`)).toBeInTheDocument();
      expect(screen.queryByTestId(`metadata-key-${value}`)).toBeInTheDocument();
    });
  });

  it("renders - add authorization", async () => {
    let metadata: Metadata = {};
    const contextMetadata: MetadataContextData = {
      metadata: metadata,
      setMetadata: (fun) => {
        if (typeof fun !== "function") {
          metadata = { ...metadata, ...fun };
        } else {
          metadata = { ...fun(metadata) };
        }
        return metadata;
      },
    };

    await act(async () => {
      render(
        <MetadataContext.Provider value={contextMetadata}>
          <MetadataModal show={true} onHide={() => {}} />
        </MetadataContext.Provider>,
      );
    });

    const element = screen.getByTestId("metadata-modal");
    expect(element).toBeInTheDocument();

    const input = screen.getByTestId("metadata-authorization-input");
    const button = screen.getByTestId("metadata-authorization-set");

    const myPrivateToken = "MyPrivateToken";

    await act(async () => {
      fireEvent.change(input, { target: { value: myPrivateToken } });
      button.click();
    });

    expect(metadata[AUTHORIZATION_METADATA_KEY]).toBe(
      `Bearer ${myPrivateToken}`,
    );
  });
});
