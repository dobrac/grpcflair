"use client";
import { Button, Dropdown, Form, InputGroup } from "react-bootstrap";
import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useSourceContext } from "@/contexts/SourceContext";
import { DEFAULT_URL } from "@/types/constants";
import protobuf from "protobufjs";
import { useSearchParams } from "next/navigation";
import { ProtobufjsRootDescriptor } from "@/types/protobufjs-types";
import descriptor from "protobufjs/ext/descriptor";

enum FileSource {
  URL = "URL",
  FILE = "File",
}

export default function Navbar() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");

  const [search, setSearch] = useState(url ?? DEFAULT_URL);
  const [file, setFile] = useState<File | null>(null);

  const { setContext } = useSourceContext();

  const [fileSource, setFileSource] = useState<FileSource>(FileSource.URL);

  const processRequest = async (url: string, extension: string) => {
    const source = await fetch(url);

    switch (extension) {
      case "json": {
        const sourceJson = await source.json();
        const content = protobuf.Root.fromJSON(sourceJson);
        setContext(content);
        break;
      }
      case "bin": {
        const sourceBin = await source.arrayBuffer();
        const uint8View = new Uint8Array(sourceBin);

        const decodedSource = descriptor.FileDescriptorSet.decode(uint8View);
        const content = (
          protobuf.Root as unknown as ProtobufjsRootDescriptor
        ).fromDescriptor(decodedSource);
        setContext(content);
        break;
      }
      default:
        return;
    }
  };

  const processUrl = async (url: string) => {
    const extension = url.split(".").pop();
    if (!extension) {
      return;
    }

    await processRequest(url, extension);
  };

  const processFile = async (file: File) => {
    const url = URL.createObjectURL(file);
    const extension = file.name.split(".").pop();
    if (!extension) {
      return;
    }

    await processRequest(url, extension);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setContext(undefined);

    switch (fileSource) {
      case FileSource.URL:
        await processUrl(search);
        break;
      case FileSource.FILE:
        if (!file) {
          return;
        }
        await processFile(file);
        break;
    }
  };

  useEffect(() => {
    if (search) {
      processUrl(search);
    }
  }, []);

  return (
    <nav
      className="d-flex flex-wrap justify-content-between px-5 py-2 column-gap-5"
      style={{ backgroundColor: "var(--bs-dark)" }}
    >
      <div className="position-relative" style={{ width: "10rem" }}>
        <Image
          src="/logo.png"
          alt="logo"
          sizes="100vw"
          fill
          style={{
            objectFit: "contain",
          }}
        />
      </div>
      <div className="flex-grow-1">
        <Form onSubmit={handleSubmit}>
          <InputGroup className="d-flex">
            <Dropdown>
              <Dropdown.Toggle>{fileSource}</Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setFileSource(FileSource.URL)}>
                  URL
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setFileSource(FileSource.FILE)}>
                  File
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {fileSource === FileSource.URL && (
              <Form.Control
                as="input"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
            )}
            {fileSource === FileSource.FILE && (
              <Form.Control
                type="file"
                accept=".json"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setFile(e.target.files?.[0] ?? null);
                }}
              />
            )}
            <Button variant="primary" type="submit">
              Explore
            </Button>
          </InputGroup>
        </Form>
      </div>
    </nav>
  );
}
