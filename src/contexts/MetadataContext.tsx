"use client";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";

export type Metadata = Record<string, string>;

interface MetadataContextData {
  metadata: Metadata;
  setMetadata: Dispatch<SetStateAction<Metadata>>;
}

const defaultValues: MetadataContextData = {
  metadata: {},
  setMetadata: () => {},
};

const MetadataContext = createContext<MetadataContextData>(defaultValues);

export function useMetadataContext() {
  return useContext(MetadataContext);
}

export default function MetadataContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [metadata, setMetadata] = useState<Metadata>({
    ...defaultValues.metadata,
  });

  const contextValue = useMemo(
    () => ({
      metadata,
      setMetadata,
    }),
    [metadata],
  );

  return (
    <MetadataContext.Provider value={contextValue}>
      {children}
    </MetadataContext.Provider>
  );
}
