import { act, render, screen } from "@testing-library/react";
import Endpoints from "@/components/Endpoints";
import { SourceContext } from "@/contexts/SourceContext";
import { DEFAULT_HOSTNAME } from "@/types/constants";
import { context } from "../../tests/protobufjs-source";
import JSONBlock from "@/components/JSONBlock";
import { Button } from "react-bootstrap";

describe("JSONBlock", () => {
  it("renders JSONBlock - dark", async () => {
    await act(async () => {
      render(
        <JSONBlock dark={true}>
          {JSON.stringify({
            services: [
              {
                name: "service1",
                url: "http://localhost:3000",
              },
            ],
          })}
        </JSONBlock>,
      );
    });

    const jsonBlock = screen.getByTestId("json-block");
    expect(jsonBlock).toBeInTheDocument();
    expect(jsonBlock).toHaveTextContent("service1");
    expect(jsonBlock).toHaveClass("bg-dark text-light");

    const codeElement = jsonBlock.firstChild;
    expect(codeElement).toBeInTheDocument();
    expect(codeElement).toHaveClass("language-json");
  });
  it("renders JSONBlock - light", async () => {
    await act(async () => {
      render(
        <JSONBlock dark={false}>
          {JSON.stringify({
            services: [
              {
                name: "service1",
                url: "http://localhost:3000",
              },
            ],
          })}
        </JSONBlock>,
      );
    });

    const jsonBlock = screen.getByTestId("json-block");
    expect(jsonBlock).toBeInTheDocument();
    expect(jsonBlock).toHaveTextContent("service1");
    expect(jsonBlock).toHaveClass("bg-body text-dark");

    const codeElement = jsonBlock.firstChild;
    expect(codeElement).toBeInTheDocument();
    expect(codeElement).toHaveClass("language-json");
  });
  it("renders JSONBlock - regular text", async () => {
    await act(async () => {
      render(<JSONBlock>Hello There</JSONBlock>);
    });

    const jsonBlock = screen.getByTestId("json-block");
    expect(jsonBlock).toBeInTheDocument();
    expect(jsonBlock).toHaveTextContent("Hello There");

    const codeElement = jsonBlock.firstChild;
    expect(codeElement).toBeInTheDocument();
    expect(codeElement).toHaveClass("language-dns");
  });
  it("renders JSONBlock - object", async () => {
    await act(async () => {
      render(
        <JSONBlock>
          <Button>Test</Button>
        </JSONBlock>,
      );
    });

    const jsonBlock = screen.queryByTestId("json-block");
    expect(jsonBlock).not.toBeInTheDocument();

    const reactBlock = screen.getByTestId("react-block");
    expect(reactBlock).toBeInTheDocument();
    expect(reactBlock).toHaveTextContent("Test");
  });
});
