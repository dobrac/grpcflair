import { act, fireEvent, render, screen } from "@testing-library/react";
import { context } from "../../../tests/protobufjs-source";
import MetadataModal from "@/components/metadata/MetadataModal";
import {
  Metadata,
  MetadataContext,
  MetadataContextData,
} from "@/contexts/MetadataContext";
import {
  AuthorizationType,
  typeToKey,
  typeToPrefix,
} from "@/components/metadata/Authorization";

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
      expect(
        screen.queryByTestId(`metadata-value-${value}`),
      ).toBeInTheDocument();
    });
  });

  it("renders - add metadata", async () => {
    const metadataToAddKey = "MYek";
    const metadataToAddValue = "MEulav";
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

    const { rerender } = await act(async () => {
      return render(
        <MetadataContext.Provider value={contextMetadata}>
          <MetadataModal show={true} onHide={() => {}} />
        </MetadataContext.Provider>,
      );
    });

    const element = screen.getByTestId("metadata-modal");
    expect(element).toBeInTheDocument();

    const inputKey = screen.getByTestId("metadata-input-key");
    const inputValue = screen.getByTestId("metadata-input-value");
    const button = screen.getByTestId("metadata-input-add");

    await act(async () => {
      fireEvent.change(inputKey, { target: { value: metadataToAddKey } });
      fireEvent.change(inputValue, { target: { value: metadataToAddValue } });
      button.click();
    });

    await act(async () => {
      contextMetadata.metadata = metadata;
      rerender(
        <MetadataContext.Provider value={contextMetadata}>
          <MetadataModal show={true} onHide={() => {}} />
        </MetadataContext.Provider>,
      );
    });

    expect(
      screen.queryByTestId(`metadata-key-${metadataToAddKey}`),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId(`metadata-value-${metadataToAddValue}`),
    ).toBeInTheDocument();
  });

  it("renders - remove metadata", async () => {
    const metadataToRemoveKey = "MYek";
    let metadata: Metadata = {
      [metadataToRemoveKey]: "MEulav",
    };
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

    const { rerender } = await act(async () => {
      return render(
        <MetadataContext.Provider value={contextMetadata}>
          <MetadataModal show={true} onHide={() => {}} />
        </MetadataContext.Provider>,
      );
    });

    const element = screen.getByTestId("metadata-modal");
    expect(element).toBeInTheDocument();

    expect(
      screen.queryByTestId(`metadata-key-${metadataToRemoveKey}`),
    ).toBeInTheDocument();

    const button = screen.getByTestId(`metadata-remove-${metadataToRemoveKey}`);

    await act(async () => {
      button.click();
    });

    await act(async () => {
      contextMetadata.metadata = metadata;
      rerender(
        <MetadataContext.Provider value={contextMetadata}>
          <MetadataModal show={true} onHide={() => {}} />
        </MetadataContext.Provider>,
      );
    });

    expect(
      screen.queryByTestId(`metadata-key-${metadataToRemoveKey}`),
    ).not.toBeInTheDocument();
  });

  const authorizationTypes = Object.values(AuthorizationType);
  authorizationTypes.forEach((type) => {
    it(`renders - add authorization - ${type}`, async () => {
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

      const select = screen.getByTestId("metadata-authorization-select");
      const input = screen.getByTestId("metadata-authorization-input");
      const button = screen.getByTestId("metadata-authorization-set");

      const myPrivateToken = "MyPrivateToken";

      await act(async () => {
        fireEvent.change(select, { target: { value: type } });
        fireEvent.change(input, { target: { value: myPrivateToken } });
        button.click();
      });

      expect(select).toHaveTextContent(type);
      expect(metadata[typeToKey[type]]).toBe(
        `${typeToPrefix[type]} ${myPrivateToken}`.trim(),
      );
    });
  });
});
