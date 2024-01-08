"use client";
import { createContext, useContext, useMemo, useState } from "react";
import { DocContext } from "@/types/doc";

interface SourceContextData {
  context?: DocContext;
  setContext: (context: DocContext) => void;
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
  const [context, setContext] = useState<DocContext>();

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
