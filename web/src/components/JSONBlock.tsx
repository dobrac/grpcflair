import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { isJSON } from "@/services/json";
import { ReactNode } from "react";

export interface JSONBlockProps {
  children: string | ReactNode;
  dark?: boolean;
  className?: string;
}

export default function JSONBlock({
  children,
  className = "",
  dark = true,
}: JSONBlockProps) {
  const classes = [
    dark ? "bg-dark text-light" : "bg-body text-dark",
    "rounded-1 m-0 py-1 px-2",
    className,
  ].join(" ");

  if (typeof children !== "string") {
    return <div className={classes}>{children}</div>;
  }

  return (
    <SyntaxHighlighter
      language={isJSON(children) ? "json" : "dns"}
      style={docco}
      className={classes}
    >
      {children}
    </SyntaxHighlighter>
  );
}
