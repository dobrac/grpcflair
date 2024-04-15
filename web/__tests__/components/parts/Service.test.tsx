import { act, render, screen } from "@testing-library/react";
import EnumType from "@/components/parts/EnumType";
import { context } from "../../../tests/protobufjs-source";
import Service from "@/components/parts/Service";

describe("Service", () => {
  const service = context.lookupService("helloworld.Greeter");
  service.resolve();

  it("renders", async () => {
    await act(async () => {
      render(<Service service={service} />);
    });

    const element = screen.getByTestId("service-detail");
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent(service.fullName.replace(".", ""));

    if (service.comment) {
      expect(element).toHaveTextContent(service.comment);
    }
  });
});
