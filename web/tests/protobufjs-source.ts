import protobuf from "protobufjs";
import sourceJson from "../__tests__/data/helloworld.json";

export const context = protobuf.Root.fromJSON(
  JSON.parse(JSON.stringify(sourceJson)),
);
export const type = context.lookupType("helloworld.TestRequest");
