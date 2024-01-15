"use client";
import Endpoints from "@/components/Endpoints";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useSourceContext } from "@/contexts/SourceContext";

export default function Home() {
  const { hostname, setHostname } = useSourceContext();
  const title = "gRPCFlair Petstore";
  const description =
    "This is a sample server Petstore server. You can find out more about gRPCFlair at https://grpcflair.io or on irc.freenode.net, #swagger. For this sample, you can use the api key special-key to test the authorization filters.";

  return (
    <main>
      <div className="py-5" style={{ backgroundColor: "whitesmoke" }}>
        <div className="container">
          <h1>{title}</h1>
          <div>gRPC Server Url</div>
          <Form
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <InputGroup className="d-flex">
              <Form.Control
                as="input"
                onChange={(e) => setHostname(e.target.value)}
                value={hostname}
              />
              <Button variant="primary" type="submit">
                Set
              </Button>
            </InputGroup>
          </Form>
          <p className="mt-4 text-secondary">{description}</p>
        </div>
      </div>
      <div className="container py-3">
        <div className="d-inline-block">
          Method
          <Form.Select aria-label="Method selection">
            <option value="web">grpc-web</option>
            <option value="server" disabled={true}>
              grpc-server (NOT IMPLEMENTED)
            </option>
          </Form.Select>
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
