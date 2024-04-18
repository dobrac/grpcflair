import JSONBlock from "@/components/JSONBlock";

export default function ResponsesList({ responses }: { responses: unknown[] }) {
  if (!responses.length) {
    return null;
  }

  return (
    <div className="d-grid gap-2">
      {responses.map((response, index) => (
        <div key={index}>
          <JSONBlock>
            <div className="text-secondary small">Response {index + 1}</div>
            <JSONBlock>{JSON.stringify(response, null, 2)}</JSONBlock>
          </JSONBlock>
        </div>
      ))}
      <JSONBlock>
        <span className="text-secondary small">
          Total responses: {responses.length}
        </span>
      </JSONBlock>
    </div>
  );
}
