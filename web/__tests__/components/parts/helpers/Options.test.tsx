import { act, render, screen } from "@testing-library/react";
import { context } from "../../../../tests/protobufjs-source";
import Options from "@/components/parts/helpers/Options";
import { getOptionsFromReflectionObject } from "@/services/protobufjs";

describe("Options", () => {
  const service = context.lookupService("helloworld.Greeter");
  service.resolve();

  const options = Object.entries(getOptionsFromReflectionObject(service));

  it("renders", async () => {
    await act(async () => {
      render(<Options reflectionObject={service} />);
    });

    const element = screen.getByTestId(`options-${service.fullName}`);
    expect(element).toBeInTheDocument();

    options.forEach(([key, value]) => {
      expect(element).toHaveTextContent(`${key}: ${JSON.stringify(value)}`);
    });

    expect(element).toHaveTextContent(`java_package: "com.example.tutorial"`);
  });

  it("renders - no options", async () => {
    const serviceNoOptions = context.lookupService("test.TestOptionsService");
    serviceNoOptions.resolve();

    await act(async () => {
      render(<Options reflectionObject={serviceNoOptions} />);
    });

    const element = screen.queryByTestId(
      `options-${serviceNoOptions.fullName}`,
    );
    expect(element).not.toBeInTheDocument();
  });
});
