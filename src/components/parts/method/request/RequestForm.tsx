import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faL } from "@fortawesome/free-solid-svg-icons/faL";
import InputFieldName from "@/components/parts/method/request/inputfield/InputFieldName";
import InputFieldValue from "@/components/parts/method/request/inputfield/InputFieldValue";
import protobuf from "protobufjs";

export interface RequestFormProps {
  method: protobuf.Method;
}

export default function RequestForm({ method }: RequestFormProps) {
  method.resolve();

  const requestType = method.resolvedRequestType;

  const fields = requestType?.fieldsArray ?? [];
  const fieldsWithoutOneOf = fields.filter((it) => !it.partOf);
  const oneofsArray = requestType?.oneofsArray ?? [];

  return (
    <table className="w-100">
      <thead className="border-bottom border-secondary-subtle small">
        <tr>
          <th className="w-25">Name</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {oneofsArray.map((oneOf) => (
          <Fragment key={oneOf.name}>
            <tr>
              <td className="align-top py-3" colSpan={2}>
                <div className="text-secondary whitespace-pre">
                  {oneOf.comment}
                </div>
                <div className="fw-bolder">{oneOf.name}</div>
              </td>
            </tr>
            {oneOf.fieldsArray.map((field) => (
              <tr key={field.name}>
                <td className="align-top py-3 d-flex gap-3 align-items-center">
                  <FontAwesomeIcon icon={faL} />
                  <InputFieldName field={field} />
                </td>
                <td className="align-top py-3">
                  <div className="text-secondary whitespace-pre">
                    {field.comment}
                  </div>
                  <InputFieldValue field={field} />
                </td>
              </tr>
            ))}
          </Fragment>
        ))}
        {fieldsWithoutOneOf.map((field) => (
          <tr key={field.name}>
            <td className="align-top py-3">
              <InputFieldName field={field} />
            </td>
            <td className="align-top py-3">
              <div className="text-secondary whitespace-pre">
                {field.comment}
              </div>
              <InputFieldValue field={field} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
