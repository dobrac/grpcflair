import SyntaxHighlighter from "react-syntax-highlighter";
import docco from "react-syntax-highlighter/dist/esm/styles/hljs/docco";

export default function JSONBlock({ children }: { children: string }) {
  const isJSON = (str: string) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

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
