import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../scss/App.scss";
import Layout from "@/components/Layout";
import SourceContextProvider from "@/contexts/SourceContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "gRPCFlair",
  description: "Interactive gRPC API documentation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SourceContextProvider>
          <Layout>{children}</Layout>
        </SourceContextProvider>
      </body>
    </html>
  );
}
