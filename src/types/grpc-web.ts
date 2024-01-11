import protobuf from "protobufjs";
import { GrpcWebClientBase, MethodDescriptor, MethodType } from "grpc-web";

function isNamespaceBase(
  current: protobuf.NamespaceBase | protobuf.ReflectionObject,
): current is protobuf.NamespaceBase {
  return (current as protobuf.NamespaceBase).nestedArray !== undefined;
}

// Source: https://github.com/protobufjs/protobuf.js/blob/master/examples/traverse-types.js
function traverseTypes(
  current: protobuf.NamespaceBase | protobuf.ReflectionObject,
  fn: (type: protobuf.Type) => void,
) {
  if (current instanceof protobuf.Type) {
    // and/or protobuf.Enum, protobuf.Service etc.
    fn(current);
  }
  if (isNamespaceBase(current)) {
    current.nestedArray.forEach(function (nested) {
      traverseTypes(nested, fn);
    });
  }
}

class DummyRPCType {
  constructor(...args: unknown[]) {}
}

/*
Plan:
- Use proto files directly
- Convert structure to own format, including comments
 */

export function run() {
  protobuf.load("/examples/proto/helloworld.proto", function (err, root) {
    if (err) throw err;
    if (!root) throw new Error("No root");

    traverseTypes(root, function (type) {
      console.log(
        type.constructor.name +
          " " +
          type.name +
          "\n  fully qualified name: " +
          type.fullName +
          "\n  defined in: " +
          type.filename +
          "\n  parent: " +
          type.parent +
          " in " +
          type.parent?.filename,
      );
      // Obtain a message type
      const Type = root.lookupType(type.fullName);
      console.log("Comment:", Type.comment);
    });

    const hostname = "http://localhost:8080";
    const client = new GrpcWebClientBase({ format: "text" }); //new GreeterClient("http://" + hostname + ":8080", null, null);

    const makeGrpcCall = function <MessageData extends object = object>(
      service: protobuf.Service,
      method: protobuf.Method,
      typeEncode: protobuf.Type,
      typeDecode: protobuf.Type,
      message: protobuf.Message,
      callback: (
        err: Error | null,
        response: protobuf.Message<MessageData>,
      ) => void,
    ) {
      const methodPath = `${hostname}/${
        // Replace starting dot "."
        service.fullName.replace(".", "")
      }/${method.name}`;

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
        callback,
      );
    };

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
  });
}
