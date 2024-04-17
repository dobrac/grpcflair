import { act, render } from "@testing-library/react";
import CollapsibleHeader from "@/components/CollapsibleHeader";

describe("CollapsibleHeader", () => {
  it("renders - expanded", async () => {
    const onClick = jest.fn();
    const elementRendered = await act(async () => {
      return render(
        <CollapsibleHeader onClick={onClick} open={true}>
          Header
        </CollapsibleHeader>,
      );
    });

    const element = elementRendered.container.firstChild;
    expect(element).toBeInTheDocument();
  });
  it("renders - collapsed", async () => {
    const onClick = jest.fn();
    const elementRendered = await act(async () => {
      return render(
        <CollapsibleHeader onClick={onClick} open={false}>
          Header
        </CollapsibleHeader>,
      );
    });

    const element = elementRendered.container.firstChild;
    expect(element).toBeInTheDocument();
  });
});
