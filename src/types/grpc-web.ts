import protobuf from "protobufjs";
import { GrpcWebClientBase, MethodDescriptor, MethodType } from "grpc-web";

class DummyRPCType {
  constructor(...args: unknown[]) {}
}

export function makeGrpcCall<MessageData extends object = object>(
  service: protobuf.Service,
  method: protobuf.Method,
  typeEncode: protobuf.Type,
  typeDecode: protobuf.Type,
  message: protobuf.Message,
  callback?: (
    err: Error | null,
    response: protobuf.Message<MessageData>,
  ) => void,
): Promise<protobuf.Message<MessageData>> {
  const hostname = "http://localhost:8080";
  const client = new GrpcWebClientBase({ format: "text" });

  const methodPath = `${hostname}/${
    // Replace starting dot "."
    service.fullName.replace(".", "")
  }/${method.name}`;

  return new Promise((resolve, reject) => {
    client.rpcCall(
      methodPath,
      // Ignored, using protobufjs directly
      {},
      {},
      new MethodDescriptor(
        method.name,
        MethodType.UNARY,
        // Ignored, using protobufjs directly
        DummyRPCType,
        // Ignored, using protobufjs directly
        DummyRPCType,
        () => {
          return typeEncode.encode(message).finish();
        },
        (bytes: Uint8Array) => {
          return typeDecode.decode(bytes);
        },
      ),
      (err, response: protobuf.Message<MessageData>) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
        callback?.(err, response);
      },
    );
  });
}

export async function run(root: protobuf.Root) {
  // const types = getTypesFromContext(root);
  // types.forEach((type) => {
  //   console.log(
  //     type.constructor.name +
  //       " " +
  //       type.name +
  //       "\n  fully qualified name: " +
  //       type.fullName +
  //       "\n  defined in: " +
  //       type.filename +
  //       "\n  parent: " +
  //       type.parent +
  //       " in " +
  //       type.parent?.filename,
  //   );
  //   // Obtain a message type
  //   const Type = root.lookupType(type.fullName);
  //   console.log("Comment:", Type.comment);
  // });

  /*const greeter = GreeterService.create(rpcImpl);
    greeter.sayHello({ name: "you" }, function (err, response) {
      console.log("Greeting:", response?.message, err);
    });*/

  const GreeterService = root.lookupService("helloworld.Greeter");

  const HelloRequest = root.lookupType("helloworld.HelloRequest");
  const HelloReply = root.lookupType("helloworld.HelloReply");
  const SayHelloMethod = GreeterService.lookup("SayHello") as protobuf.Method;

  const message = HelloRequest.create({ name: "WorldAha" });

  makeGrpcCall(
    GreeterService,
    SayHelloMethod,
    HelloRequest,
    HelloReply,
    message,
    (err, response) => {
      if (err) throw err;
      console.log("Greeting:", HelloReply.toObject(response, {}).message);
    },
  );

  // // If the application uses length-delimited buffers, there is also encodeDelimited and decodeDelimited.
  //
  // // Maybe convert the message back to a plain object
  // var object = AwesomeMessage.toObject(message, {
  //   longs: String,
  //   enums: String,
  //   bytes: String,
  //   // see ConversionOptions
  // });
}
