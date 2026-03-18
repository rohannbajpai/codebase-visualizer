import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Codebase Visualizer",
  description:
    "A Next.js control room for versioned architecture diagrams, docs, and merge-aware codebase dashboards."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
