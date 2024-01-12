"use client";
import { createContext, useContext, useMemo, useState } from "react";
import { Root } from "protobufjs";

interface SourceContextData {
  context?: Root;
  setContext: (context: Root) => void;
}

const SourceContext = createContext<SourceContextData>({
  context: undefined,
  setContext: () => {},
});

export function useSourceContext() {
  return useContext(SourceContext);
}

export default function SourceContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [context, setContext] = useState<Root>();

  const contextValue = useMemo(
    () => ({
      context,
      setContext,
    }),
    [context, setContext],
  );

  return (
    <SourceContext.Provider value={contextValue}>
      {children}
    </SourceContext.Provider>
  );
}
