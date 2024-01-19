import { GrpcWebFormat } from "@/services/grpc-web";
import { Form } from "react-bootstrap";
import { useMethodContext } from "@/contexts/MethodContext";

export default function FormatSelector() {
  const { request, functions } = useMethodContext();

  return (
    <Form.Select
      size="sm"
      value={request.format}
      onChange={(e) => {
        functions.setRequest((request) => ({
          ...request,
          format: e.target.value as GrpcWebFormat,
        }));
      }}
    >
      <option value={GrpcWebFormat.TEXT}>application/grpc-web-text</option>
      <option value={GrpcWebFormat.BINARY}>application/grpc-web</option>
    </Form.Select>
  );
}
