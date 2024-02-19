#!/usr/bin/env node
const protobuf = require("protobufjs");
const descriptor = require("protobufjs/ext/descriptor");
const fs = require("fs");

function readFileToByteArray(filePath, callback) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      const byteArray = Array.from(data);
      callback(null, byteArray);
    }
  });
}

const args = process.argv.slice(2);
const filePath = args[0];

if (!filePath) {
  console.error("No file path provided");
  process.exit(1);
}

readFileToByteArray(filePath, (err, byteArray) => {
  if (err) {
    console.error("Incorrect .bin file provided");
    process.exit(1);
  }

  const decodedDescriptor = descriptor.FileDescriptorSet.decode(byteArray);

  const root = protobuf.Root.fromDescriptor(decodedDescriptor);

  console.log(JSON.stringify(root.toJSON(), null, 2));
});
