/**
 * @jest-environment jsdom
 */
import { act, render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Test Default Heading", () => {
  it("renders a heading", async () => {
    await act(() => {
      render(<Home />);
    });

    const heading = screen.getByRole("heading", {
      name: "gRPCFlair",
    });

    expect(heading).toBeInTheDocument();
  });
});
