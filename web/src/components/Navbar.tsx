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

const URL_PARAM = "url";

enum FileSource {
  URL = "URL",
  FILE = "File",
}

export default function Navbar() {
  const searchParams = useSearchParams();
  const urlParam = searchParams.get(URL_PARAM);

  const [url, setUrl] = useState(urlParam ?? DEFAULT_URL);
  const [file, setFile] = useState<File | null>(null);

  const { setContext, setError } = useSourceContext();

  const [fileSource, setFileSource] = useState<FileSource>(FileSource.URL);

  const processRequest = async (url: string, extension: string) => {
    try {
      setError(undefined);

      const source = await fetch(url);
      if (!source.ok) {
        throw new Error(`Failed to fetch the data (${source.status})`);
      }

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
          throw new Error(
            `Invalid file type (${extension}). Supported types are: .json, .bin`,
          );
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setError(error);
      }
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

  const process = async (fileSource: FileSource) => {
    switch (fileSource) {
      case FileSource.URL:
        await processUrl(url);
        break;
      case FileSource.FILE:
        if (!file) {
          return;
        }
        await processFile(file);
        break;
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setContext(undefined);

    await process(fileSource);
  };

  useEffect(() => {
    if (url) {
      processUrl(url);
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
                <Dropdown.Item
                  onClick={() => {
                    setFileSource(FileSource.URL);
                    process(FileSource.URL);
                  }}
                >
                  URL
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setFileSource(FileSource.FILE);
                    if (file !== null) {
                      process(FileSource.FILE);
                    }
                  }}
                >
                  File
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Form.Control
              as="input"
              onChange={(e) => setUrl(e.target.value)}
              value={url}
              className={fileSource === FileSource.URL ? "d-block" : "d-none"}
            />
            <Form.Control
              type="file"
              accept=".json,.bin"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0] ?? null;
                setFile(file);
                if (file !== null) {
                  processFile(file);
                }
              }}
              className={fileSource === FileSource.FILE ? "d-block" : "d-none"}
            />
            <Button variant="primary" type="submit">
              Explore
            </Button>
          </InputGroup>
        </Form>
      </div>
    </nav>
  );
}
