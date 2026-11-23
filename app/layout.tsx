import type { Metadata } from "next";
import { Cormorant_Garamond, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600"], style: ["normal", "italic"] });
const body = IBM_Plex_Sans({ subsets: ["latin"], variable: "--font-body", weight: ["400", "500"] });
const mono = IBM_Plex_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400"] });

const themeScript = `try{document.documentElement.dataset.theme=localStorage.getItem("theme")||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");const c=navigator.connection,m=localStorage.getItem("motion")||(c&&(c.saveData||/2g|3g/.test(c.effectiveType))?"lite":"");if(m==="lite")document.documentElement.dataset.motion=m}catch(e){}`;

export const metadata: Metadata = {
  title: "Martín Llobell, Backend and AI engineer",
  description: "Backend and AI engineer from Mendoza, Argentina. LLM gateways, agent platforms, exchange risk engines and event-driven services.",
  metadataBase: new URL("https://martinllobell.github.io"),
  openGraph: { title: "Martín Llobell", description: "Backend and AI engineer", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
