"use client";
import { Button, Form } from "react-bootstrap";
import { useSourceContext } from "@/contexts/SourceContext";
import dynamic from "next/dynamic";
import { useState } from "react";
import MetadataModal from "@/components/metadata/MetadataModal";

const Endpoints = dynamic(() => import("@/components/Endpoints"), {
  ssr: false,
});

export default function Home() {
  const { hostname, setHostname } = useSourceContext();
  const title = "gRPCFlair";
  const description =
    "This is a tool to help you interact with gRPC services. You can use it to explore the service's endpoints and make requests to them, browse types and enums, and preview options.";

  const [showMetadataModal, setShowMetadataModal] = useState(false);

  return (
    <main>
      <div className="py-5" style={{ backgroundColor: "whitesmoke" }}>
        <div className="container">
          <h1>{title}</h1>
          <p className="mt-4 text-secondary">{description}</p>
        </div>
      </div>
      <div className="container py-3 d-flex flex-wrap column-gap-5 row-gap-2 align-items-end">
        <div className="d-inline-block">
          Method
          <Form.Select aria-label="Method selection">
            <option value="web">grpc-web</option>
            <option value="server" disabled={true}>
              grpc-server (NOT IMPLEMENTED)
            </option>
          </Form.Select>
        </div>
        <div className="flex-grow-1">
          <div>Base gRPC Url</div>
          <Form.Control
            as="input"
            className="w-100"
            onChange={(e) => setHostname(e.target.value)}
            value={hostname}
          />
        </div>
        <div>
          <Button
            variant="outline-primary"
            onClick={() => setShowMetadataModal(true)}
          >
            Metadata
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
