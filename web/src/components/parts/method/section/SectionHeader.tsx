import { ReactNode } from "react";

/**
 * Method header section wrapper
 */
export default function SectionHeader({ children }: { children: ReactNode }) {
  return (
    <>
      <hr className="m-0" />
      <div className="py-3 px-4 bg-light d-flex justify-content-between align-items-center">
        {children}
      </div>
      <hr className="m-0" />
    </>
  );
}
