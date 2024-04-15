import { act, render } from "@testing-library/react";
import HandleUrlHostnameParam, {
  HOSTNAME_PARAM,
} from "@/components/HandleUrlHostnameParam";
import { SourceContext, SourceContextData } from "@/contexts/SourceContext";
import { DEFAULT_HOSTNAME } from "@/types/constants";
import { context } from "../../tests/protobufjs-source";

const HOSTNAME_PARAM_VALUE = "https://hello.com:8080";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn().mockReturnValue({
    get: jest.fn().mockImplementation((key) => {
      const params: Record<string, string> = {
        [HOSTNAME_PARAM]: HOSTNAME_PARAM_VALUE,
      };
      return params?.[key];
    }),
  }),
}));

describe("HandleUrlHostnameParam", () => {
  it("handles hostname url param", async () => {
    const paramHostname = HOSTNAME_PARAM_VALUE;
    const sourceContext: SourceContextData = {
      hostname: DEFAULT_HOSTNAME,
      setHostname: jest.fn((hostname: string) => {
        sourceContext.hostname = hostname;
      }),
      context: context,
      setContext: jest.fn(),
      error: undefined,
      setError: jest.fn(),
    };

    await act(async () => {
      return render(
        <SourceContext.Provider value={sourceContext}>
          <HandleUrlHostnameParam />
        </SourceContext.Provider>,
      );
    });

    expect(sourceContext.hostname).toEqual(paramHostname);
  });
  it("keeps default hostname without any param", async () => {
    jest.resetAllMocks();

    const sourceContext: SourceContextData = {
      hostname: DEFAULT_HOSTNAME,
      setHostname: jest.fn((hostname: string) => {
        sourceContext.hostname = hostname;
      }),
      context: context,
      setContext: jest.fn(),
      error: undefined,
      setError: jest.fn(),
    };

    await act(async () => {
      return render(
        <SourceContext.Provider value={sourceContext}>
          <HandleUrlHostnameParam />
        </SourceContext.Provider>,
      );
    });

    expect(sourceContext.hostname).toEqual(DEFAULT_HOSTNAME);
  });
});
