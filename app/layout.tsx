import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600"] });
const body = IBM_Plex_Sans({ subsets: ["latin"], variable: "--font-body", weight: ["400", "500"] });

export const metadata: Metadata = {
  title: "Martín Llobell, Backend and AI engineer",
  description:
    "Backend and AI engineer from Mendoza, Argentina. LLM gateways, agent platforms, exchange risk engines and event-driven services.",
  metadataBase: new URL("https://martinllobell.github.io"),
  openGraph: { title: "Martín Llobell", description: "Backend and AI engineer", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
