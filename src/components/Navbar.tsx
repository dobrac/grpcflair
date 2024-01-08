"use client";
import { Button, Form, InputGroup } from "react-bootstrap";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useSourceContext } from "@/contexts/SourceContext";
import { DEFAULT_URL } from "@/types/constants";

export default function Navbar() {
  const [search, setSearch] = useState(DEFAULT_URL);

  const { setContext } = useSourceContext();

  const fetchUrl = async (url: string) => {
    const content = await fetch(url).then((r) => r.json());
    setContext(content);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO load url
    console.log("search", search);

    await fetchUrl(search);
  };

  useEffect(() => {
    if (search) {
      fetchUrl(search);
    }
  }, []);

  return (
    <nav
      className="d-flex flex-wrap justify-content-between px-5 py-2 column-gap-5"
      style={{ backgroundColor: "var(--bs-dark)" }}
    >
      <div className="position-relative" style={{ width: "10rem" }}>
        <Image
          src="https://static1.smartbear.co/swagger/media/assets/images/swagger_logo.svg"
          alt="logo"
          fill={true}
        />
      </div>
      <div className="flex-grow-1">
        <Form onSubmit={handleSubmit}>
          <InputGroup className="d-flex">
            <Form.Control
              as="input"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
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
