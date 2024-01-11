const protobuf = require("protobufjs");
const serializer = require("proto3-json-serializer");

const root = protobuf.loadSync("./public/examples/proto/helloworld.proto");
const Type = root.lookupType("helloworld.HelloRequest");
const message = Type.fromObject({ name: "Test" });

const serialized = serializer.toProto3JSON(message);
console.log(serialized);
