import Endpoint from "@/components/Endpoint";
import { Form } from "react-bootstrap";

export default function Home() {
  const title = "gRPCFlair Petstore";
  const description =
    "This is a sample server Petstore server. You can find out more about gRPCFlair at https://grpcflair.io or on irc.freenode.net, #swagger. For this sample, you can use the api key special-key to test the authorization filters.";
  const url = "https://petstore.grpcflair.io/v2/grpcflair.json";

  return (
    <main>
      <div className="py-5" style={{ backgroundColor: "whitesmoke" }}>
        <div className="container">
          <h1>{title}</h1>
          <a href={url} target="_blank" rel="noreferrer">
            {url}
          </a>
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
          <Endpoint />
        </div>
      </div>
    </main>
  );
}
