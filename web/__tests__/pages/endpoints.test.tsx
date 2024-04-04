import { act, render, screen } from "@testing-library/react";
import Endpoints from "@/components/Endpoints";
import { SourceContext } from "@/contexts/SourceContext";
import { DEFAULT_HOSTNAME } from "@/types/constants";
import protobuf from "protobufjs";
import sourceJson from "../data/helloworld.json";

const context = protobuf.Root.fromJSON(JSON.parse(JSON.stringify(sourceJson)));

describe("Endpoints", () => {
  beforeEach(async () => {
    await act(async () => {
      render(
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
});
