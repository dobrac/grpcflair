import Type from "@/components/parts/Type";
import protobuf from "protobufjs";

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
          <td className="align-top">0</td>
          <td className="py-2">
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
