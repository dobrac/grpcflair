import { ReactNode } from "react";

export default function SectionBody({ children }: { children: ReactNode }) {
  return <div className="py-2 px-4">{children}</div>;
}
