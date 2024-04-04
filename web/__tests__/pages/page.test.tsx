import { act, render, screen } from "@testing-library/react";
import Home from "@/app/page";

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
});
