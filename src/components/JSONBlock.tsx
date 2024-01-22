import SyntaxHighlighter from "react-syntax-highlighter";
import docco from "react-syntax-highlighter/dist/esm/styles/hljs/docco";
import { isJSON } from "@/services/json";

export interface JSONBlockProps {
  children: string;
  dark?: boolean;
}

export default function JSONBlock({ children, dark = true }: JSONBlockProps) {
  return (
    <SyntaxHighlighter
      language={isJSON(children) ? "json" : "dns"}
      style={docco}
      className={[
        dark ? "bg-dark text-light" : "bg-body text-dark",
        "rounded-1 m-0 py-1 px-2",
      ].join(" ")}
    >
      {children}
    </SyntaxHighlighter>
  );
}
