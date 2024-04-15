import { act, render } from "@testing-library/react";
import ResponsesList from "@/components/parts/method/response/ResponsesList";

describe("ResponsesList", () => {
  it("renders", async () => {
    const responses = ["a", "b", "c"];
    const renderedElement = await act(async () => {
      return render(<ResponsesList responses={responses} />);
    });

    const element = renderedElement.container.firstChild;
    expect(element).toBeInTheDocument();

    responses.forEach((response) => {
      expect(element).toHaveTextContent(response);
    });
  });

  it("renders - empty list", async () => {
    const renderedElement = await act(async () => {
      return render(<ResponsesList responses={[]} />);
    });

    const element = renderedElement.container.firstChild;
    expect(element).not.toBeInTheDocument();
  });
});
