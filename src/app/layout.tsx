import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MetaphorTune — Story Opening Generator",
  description:
    "Craft opening sentences that make the reader's brain stutter. Generate or grade first-line metaphors powered by Claude.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
