import Navbar from "@/components/Navbar";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Suspense>
        <Navbar />
      </Suspense>
      {children}
    </div>
  );
}
