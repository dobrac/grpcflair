# gRPCFlair
[![codecov](https://codecov.io/gh/dobrac/grpcflair/graph/badge.svg?token=GzeSiZBZNg)](https://codecov.io/gh/dobrac/grpcflair)

This is a tool to help you interact with gRPC services. You can use it to explore the service's endpoints and make requests to them, browse types and enums, and preview options.

![preview](https://github.com/dobrac/diploma_thesis/blob/main/images/implementation/screenshots/fullpage.png?raw=true)

## Prerequisites
To run this application, you need to have the libraries installed.

```bash
pnpm install
```

## Usage
Here are the commands you can use to run the application or generate JSON prescription for the proto files.

### Website
#### Development
To run the website in development mode, use the following command.

```bash
pnpm -C web run dev
```

#### Production
To run the website in production mode, use the following commands. First, build the website and then start the server. The server will be available at http://localhost:3000 by default.

```bash
pnpm -C web run build
pnpm -C web run start
```

### JSON Generation
Generate a JSON from the proto files. The source files can be a single file or a list of files separated by a space or a folder/folders.

```bash
gf-proto-to-json ${SOURCE_PROTO_FILES} > ${EXPORTED_NAME}.json
```

### Reflection to JSON Generation
1) Create a protoset file (it can be done using different ways, this is just an example).

```bash
grpcurl -protoset-out descriptors.bin -plaintext localhost:8980 describe
```

2) Generate a JSON from the protoset file. The file should be a single file in the .bin format.

```bash
gf-reflection-to-json ${SOURCE_BIN_FILE} > ${EXPORTED_NAME}.json
```

## Testing Server
To test the application, you can use the example testing server and Envoy proxy. It is a simple gRPC server that has a few endpoints and types.
Source: https://github.com/grpc/grpc-web/tree/master/net/grpc/gateway/examples/helloworld

1) Go to the example folder.

```bash
cd example
```

2) Start the Envoy proxy.

(Linux users: Use address: localhost instead of address: host.docker.internal in the bottom section.)

```bash
docker run -d -v "$(pwd)"/envoy-proxy.yaml:/etc/envoy/envoy.yaml:ro -p 8080:8080 -p 9901:9901 envoyproxy/envoy:v1.22.0
```

3) Run the gRPC server.

```bash
node server.js
```

4) Access the (already running) website and set the server URL to http://localhost:8080.
