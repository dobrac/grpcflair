import protobuf from "protobufjs";
import { IFileDescriptorSet } from "protobufjs/ext/descriptor";

interface ProtobufjsRootDescriptor {
  toDescriptor(
    protoVersion: string,
  ): protobuf.Message<IFileDescriptorSet> & IFileDescriptorSet;
  fromDescriptor(
    descriptor: IFileDescriptorSet | protobuf.Reader | Uint8Array,
  ): protobuf.Root;
}
