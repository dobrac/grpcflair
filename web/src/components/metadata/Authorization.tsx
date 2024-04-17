import { Button, Form, InputGroup } from "react-bootstrap";
import { FormEvent, useState } from "react";
import { useMetadataContext } from "@/contexts/MetadataContext";

export enum AuthorizationType {
  BEARER = "BEARER",
  BASIC = "BASIC",
  API_KEY = "API_KEY",
}

export const typeToKey: Record<AuthorizationType, string> = {
  [AuthorizationType.BEARER]: "authorization",
  [AuthorizationType.BASIC]: "authorization",
  [AuthorizationType.API_KEY]: "api_key",
};

export const typeToPrefix: Record<AuthorizationType, string> = {
  [AuthorizationType.BEARER]: "Bearer",
  [AuthorizationType.BASIC]: "Basic",
  [AuthorizationType.API_KEY]: "",
};

/**
 * Authorization input form
 */
export default function Authorization() {
  const [value, setValue] = useState("");
  const authorizationTypes = Object.values(AuthorizationType);
  const [authorizationType, setAuthorizationType] = useState(
    AuthorizationType.BEARER,
  );

  const { setMetadata } = useMetadataContext();

  const handleMetadataAdd = async (
    type: AuthorizationType,
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const key = typeToKey[type];
    const prefix = typeToPrefix[type];

    setMetadata((metadata) => ({
      ...metadata,
      [key]: (prefix + " " + value.replace(prefix, "")).trim(),
    }));

    setValue("");
  };

  return (
    <div>
      <div className="fw-bolder">Authorization</div>
      <Form.Select
        size="sm"
        value={authorizationType}
        onChange={(e) => {
          setAuthorizationType(e.target.value as AuthorizationType);
        }}
      >
        {authorizationTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </Form.Select>
      <Form
        onSubmit={handleMetadataAdd.bind(null, authorizationType)}
        className="d-flex align-items-center gap-1"
        style={{ gridColumn: "span 3" }}
      >
        <div>{typeToKey[authorizationType]}:</div>
        <div>{typeToPrefix[authorizationType]}</div>
        <InputGroup>
          <Form.Control
            type="input"
            data-testid="metadata-authorization-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button
            variant="light"
            type="submit"
            data-testid="metadata-authorization-set"
          >
            Set
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
}
