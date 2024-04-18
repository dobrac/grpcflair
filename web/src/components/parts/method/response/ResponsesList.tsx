import JSONBlock from "@/components/JSONBlock";

export default function ResponsesList({ responses }: { responses: unknown[] }) {
  if (!responses.length) {
    return null;
  }

  return (
    <>
      <div
        className="d-flex flex-column-reverse overflow-y-auto rounded"
        style={{
          maxHeight: "50vh",
        }}
      >
        <div className="d-grid gap-2">
          {responses.map((response, index) => (
            <JSONBlock key={index}>
              <div className="text-secondary small">Response {index + 1}</div>
              <JSONBlock>{JSON.stringify(response, null, 2)}</JSONBlock>
            </JSONBlock>
          ))}
        </div>
      </div>
      <JSONBlock dark={false}>
        <span className="text-secondary small">
          Total responses: {responses.length}
        </span>
      </JSONBlock>
    </>
  );
}
