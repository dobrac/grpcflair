import Type from "@/components/parts/Type";
import protobuf from "protobufjs";
import { StatusCode } from "grpc-web";

export default function ResponseExample({
  responseType,
}: {
  responseType: protobuf.Type | null;
}) {
  return (
    <table className="w-100">
      <thead className="border-bottom border-secondary-subtle small">
        <tr>
          <th className="w-25">Code</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="align-top">{StatusCode.OK}</td>
          <td className="py-2">
            OK
            <div className="small text-secondary whitespace-pre">
              Response message type
            </div>
            {!responseType && (
              <div className="text-secondary">No response type</div>
            )}
            {responseType && <Type type={responseType} dark expanded={true} />}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
