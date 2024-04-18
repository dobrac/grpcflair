import { Button, Form, InputGroup } from "react-bootstrap";
import { FormEvent, Fragment, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faRemove } from "@fortawesome/free-solid-svg-icons/faRemove";
import { useMetadataContext } from "@/contexts/MetadataContext";

export interface MetadataTableProps {}

export default function HeadersTable({}: MetadataTableProps) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  const { metadata, setMetadata } = useMetadataContext();

  const handleMetadataAdd = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMetadata((metadata) => ({
      ...metadata,
      [key]: value,
    }));

    setKey("");
    setValue("");
  };

  const handleMetadataRemove = (key: string) => {
    setMetadata((metadataOld) => {
      const metadata = { ...metadataOld };
      delete metadata[key];
      return metadata;
    });
  };

  return (
    <div>
      <div className="grid-metadata">
        <div className="fw-bolder px-2">Key</div>
        <div className="fw-bolder px-2">Value</div>
        <div>&nbsp;</div>
        {Object.entries(metadata).map(([key, value]) => (
          <Fragment key={key}>
            <div
              className="border px-2 bg-light-subtle text-secondary text-break"
              data-testid={"metadata-key-" + key}
            >
              {key}
            </div>
            <div
              className="border px-2 bg-light-subtle text-secondary text-break"
              data-testid={"metadata-value-" + value}
            >
              {value}
            </div>
            <div>
              <Button
                variant="outline-danger"
                onClick={() => handleMetadataRemove(key)}
                data-testid={`metadata-remove-${key}`}
              >
                <FontAwesomeIcon icon={faRemove} />
              </Button>
            </div>
          </Fragment>
        ))}
        <Form onSubmit={handleMetadataAdd} style={{ gridColumn: "span 3" }}>
          <InputGroup>
            <Form.Control
              type="input"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              data-testid="metadata-input-key"
            />
            <Form.Control
              type="input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              data-testid="metadata-input-value"
            />
            <Button
              variant="primary"
              type="submit"
              data-testid="metadata-input-add"
            >
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </InputGroup>
        </Form>
      </div>
    </div>
  );
}
