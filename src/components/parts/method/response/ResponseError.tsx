import { RpcError } from "grpc-web";
import JSONBlock from "@/components/JSONBlock";

export default function ResponseError({ error }: { error: Error | undefined }) {
  if (!error) {
    return null;
  }

  return (
    <div className="text-white bg-danger p-2 rounded-1">
      {error instanceof RpcError && (
        <>
          <div>Error {error.code}</div>
        </>
      )}
      <div>{error.message}</div>
      {error instanceof RpcError && (
        <>
          <div>Metadata</div>
          <JSONBlock>{JSON.stringify(error.metadata, null, 2)}</JSONBlock>
        </>
      )}
    </div>
  );
}
