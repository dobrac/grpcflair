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
import { GrpcWebFormat } from "@/types/grpc-web";
import protobuf from "protobufjs";
import { getTypeDefaultValues } from "@/services/protobufjs";

type RequestData = Record<string, unknown>;
type CancelFunction = () => void;

interface MethodRequest {
  format: GrpcWebFormat;
  metadata?: Record<string, string>;
  data?: RequestData;
}

interface MethodResponse {
  error?: Error;
  metadata?: Record<string, string>;
  data?: unknown[];
}

interface MethodFunctions {
  setRequest: Dispatch<SetStateAction<MethodRequest>>;
  setResponse: Dispatch<SetStateAction<MethodResponse | undefined>>;
  cancel?: CancelFunction;
  setCancelFunction: Dispatch<SetStateAction<CancelFunction | undefined>>;
}

interface MethodContextData {
  functions: MethodFunctions;
  request: MethodRequest;
  response?: MethodResponse;
  processing: boolean;
}

const defaultValues: MethodContextData = {
  processing: false,
  request: {
    format: GrpcWebFormat.TEXT,
  },
  functions: {
    setRequest: () => {},
    setResponse: () => {},
    setCancelFunction: () => {},
  },
};

const SourceContext = createContext<MethodContextData>(defaultValues);

export function useMethodContext() {
  return useContext(SourceContext);
}

export default function MethodContextProvider({
  children,
  method,
}: {
  children: ReactNode;
  method: protobuf.Method;
}) {
  method.resolve();

  const requestType = method.resolvedRequestType;
  const defaultRequestData = getTypeDefaultValues(requestType, true);

  const [cancelFunction, setCancelFunction] = useState<
    CancelFunction | undefined
  >(defaultValues.functions.cancel);
  const [request, setRequest] = useState<MethodRequest>({
    ...defaultValues.request,
    data: defaultRequestData,
  });
  const [response, setResponse] = useState<MethodResponse | undefined>(
    defaultValues.response,
  );

  const processing = !!cancelFunction;

  const contextValue = useMemo(
    () => ({
      functions: {
        setRequest,
        setResponse,
        cancel: cancelFunction,
        setCancelFunction,
      },
      request,
      response,
      processing,
    }),
    [request, response, processing, cancelFunction],
  );

  return (
    <SourceContext.Provider value={contextValue}>
      {children}
    </SourceContext.Provider>
  );
}
