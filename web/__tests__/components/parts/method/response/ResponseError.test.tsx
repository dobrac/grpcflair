import { act, render } from "@testing-library/react";
import ResponseError from "@/components/parts/method/response/ResponseError";
import { RpcError, StatusCode } from "grpc-web";

describe("ResponseError", () => {
  it("renders Error", async () => {
    const errorMessage = "test error message";
    const error = new Error(errorMessage);
    const renderedElement = await act(async () => {
      return render(<ResponseError error={error} />);
    });

    const element = renderedElement.container.firstChild;
    expect(element).toBeInTheDocument();

    expect(element).toHaveTextContent(errorMessage);
  });

  it("renders RpcError", async () => {
    const errorMessage = "test error message";
    const metadata = {
      metadataKey: "testMetadata",
    };
    const error = new RpcError(StatusCode.ABORTED, errorMessage, metadata);
    const renderedElement = await act(async () => {
      return render(<ResponseError error={error} />);
    });

    const element = renderedElement.container.firstChild;
    expect(element).toBeInTheDocument();

    expect(element).toHaveTextContent(error.code.toString());
    expect(element).toHaveTextContent(errorMessage);
    expect(element).toHaveTextContent("Metadata");
    expect(element).toHaveTextContent(metadata.metadataKey);
  });

  it("renders nothing when no error", async () => {
    const renderedElement = await act(async () => {
      return render(<ResponseError error={undefined} />);
    });

    const element = renderedElement.container.firstChild;
    expect(element).not.toBeInTheDocument();
  });
});
