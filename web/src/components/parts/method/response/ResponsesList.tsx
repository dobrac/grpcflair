import JSONBlock from "@/components/JSONBlock";

export default function ResponsesList({ responses }: { responses: unknown[] }) {
  if (!responses.length) {
    return null;
  }

  return (
    <div className="d-grid gap-2">
      {responses.map((response, index) => (
        <div key={index}>
          <JSONBlock>{JSON.stringify(response, null, 2)}</JSONBlock>
        </div>
      ))}
    </div>
  );
}
