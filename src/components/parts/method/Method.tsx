import { Badge, Collapse, ProgressBar } from "react-bootstrap";
import protobuf from "protobufjs";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons/faChevronUp";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import YesNoIcon from "@/components/YesNoIcon";
import { getColorFromMethodType, getMethodType } from "@/services/protobufjs";
import InputFieldValue from "@/components/parts/method/request/inputfields/InputFieldValue";
import { useSourceContext } from "@/contexts/SourceContext";
import InputFieldName from "@/components/parts/method/request/inputfields/InputFieldName";
import ResponseError from "@/components/parts/method/response/ResponseError";
import ResponsesList from "@/components/parts/method/response/ResponsesList";
import ResponseExample from "@/components/parts/method/response/ResponseExample";
import { useMethodContext } from "@/contexts/MethodContext";
import JSONBlock from "@/components/JSONBlock";
import FormatSelector from "@/components/parts/method/request/FormatSelector";
import MethodExecute from "@/components/parts/method/request/MethodExecute";
import SectionBody from "./section/SectionBody";
import SectionHeader from "@/components/parts/method/section/SectionHeader";

export interface ServiceProps {
  service: protobuf.Service;
  method: protobuf.Method;
}

export default function Method({ service, method }: ServiceProps) {
  method.resolve();

  const { hostname } = useSourceContext();
  const { processing, response, request, functions } = useMethodContext();

  const [open, setOpen] = useState(false);

  const requestType = method.resolvedRequestType;
  const responseType = method.resolvedResponseType;

  const color = getColorFromMethodType(method);

  if (!requestType || !responseType) {
    return (
      <div>
        <div className="fw-bold fs-6">{method.name}</div>
        <div className="small text-secondary fst-italic">
          Unable to resolve request/response type
        </div>
      </div>
    );
  }

  return (
    <div key={method.name} className={"card bg-" + color + "-subtle"}>
      <button
        className="p-0 border-0 rounded-bottom-0 text-start btn hover-bg-darken py-2 px-3"
        onClick={() => setOpen((open) => !open)}
      >
        <div className="d-flex align-items-center gap-2">
          <Badge bg={color}>{getMethodType(method)}</Badge>
          <div className="fw-bold fs-6">
            {method.name}
            {!!method.requestStream && (
              <span className="fw-normal small text-secondary fst-italic ms-1">
                (Not supported yet)
              </span>
            )}
          </div>
          <div className="flex-grow-1 small text-secondary ms-1">
            {method.comment}
          </div>
          <div>
            {open ? (
              <FontAwesomeIcon icon={faChevronUp} />
            ) : (
              <FontAwesomeIcon icon={faChevronDown} />
            )}
          </div>
        </div>
      </button>
      <Collapse in={open}>
        <div>
          <SectionHeader>
            <div>
              <span className="fw-bolder">Parameters</span>
              {!!method.requestStream && (
                <span className="ms-1">
                  streaming: <YesNoIcon value={true} className="ms-1" />
                </span>
              )}
            </div>
          </SectionHeader>
          <SectionBody>
            <table className="w-100">
              <thead className="border-bottom border-secondary-subtle small">
                <tr>
                  <th className="w-25">Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(requestType.fields).map((field) => (
                  <tr key={field.name}>
                    <td className="align-top py-3">
                      <InputFieldName field={field} />
                    </td>
                    <td className="align-top py-3">
                      <div className="text-secondary">{field.comment}</div>
                      <InputFieldValue
                        field={field}
                        value={request.data?.[field.name]}
                        onChange={(value) => {
                          functions.setRequest((it) => ({
                            ...it,
                            data: {
                              ...it.data,
                              [field.name]: value,
                            },
                          }));
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <MethodExecute service={service} method={method} />
          </SectionBody>
          <SectionHeader>
            <div>
              <span className="fw-bolder">Responses</span>
              {!!method.responseStream && (
                <span className="ms-1">
                  streaming: <YesNoIcon value={true} className="ms-1" />
                </span>
              )}
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="fw-bolder small text-nowrap">Content type</span>
              <FormatSelector />
            </div>
          </SectionHeader>
          <SectionBody>
            <div className="d-grid gap-4">
              <div className="d-grid gap-2">
                <div className="fw-bolder small">Request server</div>
                <JSONBlock>{hostname}</JSONBlock>
              </div>
              <div className="d-grid gap-2">
                <div className="fw-bolder small">Server responses</div>
                {!response && <span className="small">No response yet</span>}
                {processing && <ProgressBar animated now={100} />}
                <ResponsesList responses={response?.data ?? []} />
                <ResponseError error={response?.error} />
              </div>
              <div className="d-grid gap-2">
                <div className="fw-bolder small">Responses</div>
                <ResponseExample responseType={responseType} />
              </div>
            </div>
          </SectionBody>
        </div>
      </Collapse>
    </div>
  );
}
