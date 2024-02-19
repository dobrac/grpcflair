# grpcflair

## JSON Generation
```bash
pnpm run proto-to-json ${SOURCE_PROTO_FILES} > ${EXPORTED_NAME}.json
```

## Reflection to JSON Generation
Create protoset file (can be done using different ways, it's not important)
```bash
grpcurl -protoset-out descriptors.bin -plaintext localhost:8980 describe
```

Generate JSON from the protoset file
```bash
pnpm run reflection-to-json ${SOURCE_BIN_FILE} > ${EXPORTED_NAME}.json
```