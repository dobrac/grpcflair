import { Badge, Collapse, ProgressBar, Spinner } from "react-bootstrap";
import protobuf from "protobufjs";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons/faChevronUp";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import YesNoIcon from "@/components/YesNoIcon";
import { getColorFromMethodType, getMethodType } from "@/services/protobufjs";
import { useSourceContext } from "@/contexts/SourceContext";
import ResponseError from "@/components/parts/method/response/ResponseError";
import ResponsesList from "@/components/parts/method/response/ResponsesList";
import ResponseExample from "@/components/parts/method/response/ResponseExample";
import { useMethodContext } from "@/contexts/MethodContext";
import JSONBlock from "@/components/JSONBlock";
import FormatSelector from "@/components/parts/method/request/FormatSelector";
import RequestFormExecution from "@/components/parts/method/request/RequestFormExecution";
import SectionBody from "./section/SectionBody";
import SectionHeader from "@/components/parts/method/section/SectionHeader";
import RequestForm from "@/components/parts/method/request/RequestForm";
import Options from "@/components/parts/helpers/Options";

const COMMENT_DELIMITER = "\n";

/**
 * Split comment to two parts: first line and the rest, filtering out starting empty lines
 * @param comment Comment to split
 */
function splitCommentToTwoParts(comment: string) {
  const [commentFirstLine, ...commentRestLines] = comment?.split(
    COMMENT_DELIMITER,
  ) ?? [""];

  // Find first non-empty line
  const commentsFirstNonEmptyIndex = commentRestLines.findIndex(
    (line) => line.trim() !== "",
  );

  let commentRest: string;
  if (commentsFirstNonEmptyIndex === -1) {
    commentRest = "";
  } else {
    commentRest = commentRestLines
      .slice(commentsFirstNonEmptyIndex)
      .join(COMMENT_DELIMITER);
  }

  return [commentFirstLine, commentRest] as const;
}

export interface ServiceProps {
  service: protobuf.Service;
  method: protobuf.Method;
}

export default function Method({ service, method }: ServiceProps) {
  method.resolve();

  const { hostname } = useSourceContext();
  const { processing, response, request } = useMethodContext();

  const [open, setOpen] = useState(false);

  const responseType = method.resolvedResponseType;

  const color = getColorFromMethodType(method);

  const [commentFirstLine, commentRest] = splitCommentToTwoParts(
    method.comment ?? "",
  );

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
            {/* Show only first line in the collapsed state */}
            {commentFirstLine}
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
          {!!commentRest && (
            <SectionBody>
              <div className="small text-secondary whitespace-pre">
                {commentRest}
              </div>
            </SectionBody>
          )}
          <Options reflectionObject={method} className="mt-2" />
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
            <RequestForm method={method} />
            <RequestFormExecution service={service} method={method} />
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
              {!!response && (
                <>
                  <div className="d-grid gap-2">
                    <div className="fw-bolder small">Request JSON</div>
                    <div>
                      <JSONBlock dark={false} className="rounded-bottom-0">
                        <span className="small">Metadata</span>
                      </JSONBlock>
                      <JSONBlock dark={false} className="rounded-top-0">
                        {JSON.stringify(request.metadata, null, 2)}
                      </JSONBlock>
                    </div>
                    <JSONBlock>
                      {JSON.stringify(request.message, null, 2)}
                    </JSONBlock>
                  </div>
                  <div className="d-grid gap-2">
                    <div className="fw-bolder small">Request server</div>
                    <JSONBlock>{hostname}</JSONBlock>
                  </div>
                  <div className="d-grid gap-2">
                    <div className="fw-bolder small">Server responses</div>
                    {!response && (
                      <span className="small">No response yet</span>
                    )}
                    {processing && <ProgressBar animated now={100} />}

                    <div>
                      <JSONBlock dark={false} className="rounded-bottom-0">
                        <span className="small">Headers</span>
                        {processing && (
                          <Spinner
                            animation="grow"
                            size="sm"
                            className="ms-2"
                          />
                        )}
                      </JSONBlock>
                      <JSONBlock dark={false} className="rounded-top-0">
                        {!processing &&
                          JSON.stringify(response?.headers ?? {}, null, 2)}
                      </JSONBlock>
                    </div>

                    <ResponsesList responses={response?.data ?? []} />
                    <ResponseError error={response?.error} />

                    {!processing && (
                      <div>
                        <JSONBlock dark={false} className="rounded-bottom-0">
                          <span className="small">Trailers</span>
                        </JSONBlock>
                        <JSONBlock dark={false} className="rounded-top-0">
                          {JSON.stringify(response?.trailers ?? {}, null, 2)}
                        </JSONBlock>
                      </div>
                    )}
                  </div>
                </>
              )}
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
