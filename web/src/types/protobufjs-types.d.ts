import protobuf from "protobufjs";
import { IFileDescriptorSet } from "protobufjs/ext/descriptor";

/**
 * Interface for ProtobufjsRootDescriptor for the root object support for gRPC reflection
 */
interface ProtobufjsRootDescriptor {
  toDescriptor(
    protoVersion: string,
  ): protobuf.Message<IFileDescriptorSet> & IFileDescriptorSet;
  fromDescriptor(
    descriptor:
      | protobuf.Message<IFileDescriptorSet>
      | IFileDescriptorSet
      | protobuf.Reader
      | Uint8Array,
  ): protobuf.Root;
}
