import { Button, Modal } from "react-bootstrap";
import HeadersTable from "@/components/metadata/HeadersTable";
import Authorization from "@/components/metadata/Authorization";

export interface MetadataModalProps {
  show: boolean;
  onHide: () => void;
}

export default function MetadataModal(props: MetadataModalProps) {
  const { show, onHide } = props;

  return (
    <Modal
      show={show}
      size="lg"
      centered
      animation={false}
      onHide={onHide}
      data-testid="metadata-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Metadata</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-grid gap-4">
        <HeadersTable />
        <Authorization />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
