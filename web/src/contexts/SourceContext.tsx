"use client";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { Root } from "protobufjs";
import { DEFAULT_HOSTNAME } from "@/types/constants";

interface SourceContextData {
  hostname: string;
  setHostname: (hostname: string) => void;
  context?: Root;
  setContext: (context: Root | undefined) => void;
  error?: Error;
  setError: (error: Error | undefined) => void;
}

const SourceContext = createContext<SourceContextData>({
  hostname: DEFAULT_HOSTNAME,
  setHostname: () => {},
  context: undefined,
  setContext: () => {},
  error: undefined,
  setError: () => {},
});

export function useSourceContext() {
  return useContext(SourceContext);
}

export default function SourceContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [hostname, setHostname] = useState<string>(DEFAULT_HOSTNAME);
  const [error, setError] = useState<Error>();
  const [context, setContext] = useState<Root>();

  const contextValue = useMemo(
    () => ({
      hostname,
      setHostname,
      context,
      setContext,
      error,
      setError,
    }),
    [hostname, context, error],
  );

  return (
    <SourceContext.Provider value={contextValue}>
      {children}
    </SourceContext.Provider>
  );
}
