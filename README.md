# gRPCFlair

This is a tool to help you interact with gRPC services. You can use it to explore the service's endpoints and make requests to them, browse types and enums, and preview options.

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