import { ReactNode } from "react";

/**
 * Method body section wrapper
 */
export default function SectionBody({ children }: { children: ReactNode }) {
  return <div className="py-2 px-4">{children}</div>;
}
