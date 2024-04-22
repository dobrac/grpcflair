"use client";
import { Badge, Button, Form } from "react-bootstrap";
import { useSourceContext } from "../contexts/SourceContext";
import dynamic from "next/dynamic";
import { Suspense, useState } from "react";
import MetadataModal from "../components/metadata/MetadataModal";
import HandleUrlHostnameParam from "@/components/HandleUrlHostnameParam";
import { useMetadataContext } from "@/contexts/MetadataContext";

const Endpoints = dynamic(() => import("../components/Endpoints"), {
  ssr: false,
});

export default function Home() {
  const { hostname, setHostname } = useSourceContext();
  const title = "gRPCFlair";
  const description =
    "This is a tool to help you interact with gRPC services. You can use it to explore the service's endpoints and make requests to them, browse types and enums, and preview options.";

  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const { metadata } = useMetadataContext();

  return (
    <main>
      <Suspense>
        <HandleUrlHostnameParam />
      </Suspense>
      <div className="py-5" style={{ backgroundColor: "whitesmoke" }}>
        <div className="container">
          <h1>{title}</h1>
          <p className="mt-4 text-secondary">{description}</p>
        </div>
      </div>
      <div className="container py-3 d-grid column-gap-4 row-gap-4 align-items-center grid-settings-global">
        <div>
          Method
          <Form.Select
            aria-label="Method selection"
            style={{ width: "10rem" }}
            size="sm"
          >
            <option value="web">grpc-web</option>
            <option value="server" disabled={true}>
              grpc-server (NOT IMPLEMENTED)
            </option>
          </Form.Select>
        </div>
        <div>
          <div>Base gRPC Url</div>
          <Form.Control
            as="input"
            onChange={(e) => setHostname(e.target.value)}
            value={hostname}
            size="sm"
            style={{ width: "20rem" }}
            data-testid="hostname-input"
          />
        </div>
        <hr className="d-block d-lg-none" />
        <div className="ms-lg-auto">
          <Button
            variant="outline-primary"
            onClick={() => setShowMetadataModal(true)}
            data-testid="metadata-button"
          >
            {metadata && Object.keys(metadata).length > 0 && (
              <Badge bg="dark" className="me-2">
                {Object.keys(metadata).length}
              </Badge>
            )}
            Metadata & Authorization
          </Button>
          <MetadataModal
            show={showMetadataModal}
            onHide={() => setShowMetadataModal(false)}
          />
        </div>
      </div>
      <div className="py-3" style={{ backgroundColor: "whitesmoke" }}>
        <div className="container">
          <Endpoints />
        </div>
      </div>
    </main>
  );
}
