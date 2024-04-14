import { act, render, screen } from "@testing-library/react";
import { context } from "../../../tests/protobufjs-source";
import MetadataModal from "@/components/metadata/MetadataModal";

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
});
