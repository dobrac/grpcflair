import { Button, Form, InputGroup } from "react-bootstrap";
import { FormEvent, useState } from "react";
import { useMetadataContext } from "@/contexts/MetadataContext";
import { AUTHORIZATION_METADATA_KEY } from "@/types/constants";

const VALUE_PREFIX = "Bearer ";

export default function Authorization() {
  const [value, setValue] = useState("");

  const { setMetadata } = useMetadataContext();

  const handleMetadataAdd = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMetadata((metadata) => ({
      ...metadata,
      [AUTHORIZATION_METADATA_KEY]:
        VALUE_PREFIX + value.replace(VALUE_PREFIX, ""),
    }));

    setValue("");
  };

  return (
    <div>
      <div className="fw-bolder">Authorization</div>
      <Form onSubmit={handleMetadataAdd} style={{ gridColumn: "span 3" }}>
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
