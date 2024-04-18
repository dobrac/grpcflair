import { RpcError } from "grpc-web";
import JSONBlock from "@/components/JSONBlock";

export default function ResponseError({ error }: { error: Error | undefined }) {
  if (!error) {
    return null;
  }

  return (
    <div className="text-white bg-danger p-2 rounded-1 small">
      {error instanceof RpcError && (
        <>
          <div>Error {error.code}</div>
        </>
      )}
      <div>{error.message}</div>
      {error instanceof RpcError && (
        <>
          <JSONBlock className="rounded-bottom-0">
            <span className="small">Metadata</span>
          </JSONBlock>
          <JSONBlock className="rounded-top-0">
            {JSON.stringify(error.metadata, null, 2)}
          </JSONBlock>
        </>
      )}
    </div>
  );
}
