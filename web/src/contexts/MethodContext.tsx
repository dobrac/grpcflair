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
import { GrpcWebFormat } from "../types/grpc-web";
import protobuf from "protobufjs";
import { transformTypeValues } from "@/services/protobufjs";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getFieldYupType } from "@/services/yup";
import { formTransformation } from "@/services/form";
import { Metadata } from "@/contexts/MetadataContext";

type CancelFunction = () => void;

export interface MethodRequest {
  format: GrpcWebFormat;
  metadata?: Metadata;
  message?: object;
}

export interface MethodResponse {
  error?: Error;
  headers?: Metadata;
  trailers?: Metadata;
  data?: unknown[];
}

export interface MethodFunctions {
  setRequest: Dispatch<SetStateAction<MethodRequest>>;
  setResponse: Dispatch<SetStateAction<MethodResponse | undefined>>;
  cancel?: CancelFunction;
  setCancelFunction: Dispatch<SetStateAction<CancelFunction | undefined>>;
}

export interface MethodContextData {
  functions: MethodFunctions;
  request: MethodRequest;
  response?: MethodResponse;
  processing: boolean;
}

export const defaultMethodContextData: MethodContextData = {
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

export const SourceContext = createContext<MethodContextData>(
  defaultMethodContextData,
);

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

  const [cancelFunction, setCancelFunction] = useState<
    CancelFunction | undefined
  >(defaultMethodContextData.functions.cancel);

  const [request, setRequest] = useState<MethodRequest>({
    ...defaultMethodContextData.request,
  });
  const [response, setResponse] = useState<MethodResponse | undefined>(
    defaultMethodContextData.response,
  );

  const processing = !!cancelFunction;

  const defaultRequestData = transformTypeValues(
    requestType,
    formTransformation,
  );

  const schema = yup.object(transformTypeValues(requestType, getFieldYupType));

  const methods = useForm({
    defaultValues: defaultRequestData,
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

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
    <FormProvider {...methods}>
      <SourceContext.Provider value={contextValue}>
        {children}
      </SourceContext.Provider>
    </FormProvider>
  );
}
