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
import { transformTypeValues } from "@/services/protobufjs";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getFieldYupType } from "@/services/yup";
import { formTransformation } from "@/services/form";

type CancelFunction = () => void;

interface MethodRequest {
  format: GrpcWebFormat;
  message?: object;
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

  const [cancelFunction, setCancelFunction] = useState<
    CancelFunction | undefined
  >(defaultValues.functions.cancel);

  const [request, setRequest] = useState<MethodRequest>({
    ...defaultValues.request,
  });
  const [response, setResponse] = useState<MethodResponse | undefined>(
    defaultValues.response,
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
