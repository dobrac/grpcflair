import SyntaxHighlighter from "react-syntax-highlighter";
import docco from "react-syntax-highlighter/dist/esm/styles/hljs/docco";
import { isJSON } from "@/services/json";

export default function JSONBlock({ children }: { children: string }) {
  return (
    <SyntaxHighlighter
      language={isJSON(children) ? "json" : "dns"}
      style={docco}
      className="bg-dark text-light rounded-1 m-0 py-1 px-2"
    >
      {children}
    </SyntaxHighlighter>
  );
}
