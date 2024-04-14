import { act, render, screen } from "@testing-library/react";
import Endpoints from "@/components/Endpoints";
import { SourceContext } from "@/contexts/SourceContext";
import { DEFAULT_HOSTNAME } from "@/types/constants";
import { context } from "../../tests/protobufjs-source";
import JSONBlock from "@/components/JSONBlock";
import { Button } from "react-bootstrap";
import YesNoIcon from "@/components/YesNoIcon";

describe("YesNoIcon", () => {
  it("renders YesNoIcon - true", async () => {
    await act(async () => {
      render(<YesNoIcon value={true} />);
    });

    const icon = screen.getByTestId("yesno-icon");
    expect(icon).toBeInTheDocument();
    expect(icon.firstChild).toHaveRole("img");
  });
  it("renders YesNoIcon - false", async () => {
    await act(async () => {
      render(<YesNoIcon value={false} />);
    });

    const icon = screen.getByTestId("yesno-icon");
    expect(icon).toBeInTheDocument();
    expect(icon.firstChild).toHaveRole("img");
  });
});
