import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Link from "next/link";
import { ENV, PREVIEW_MODE } from "@/lib/env";

const sg = Space_Grotesk({ subsets: ["latin"], variable: "--font-spacegrotesk", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jbm = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jbm", display: "swap" });

export const metadata: Metadata = {
  title: "Meridian Atlas - located observations, confirmed by consensus",
  description: "A cartographic field atlas on GenLayer. Record a located claim with a source; a validator set reads it and confirms or refutes it against the place.",
};
export const viewport: Viewport = { themeColor: "#EFEADC", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sg.variable} ${inter.variable} ${jbm.variable}`}>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <Providers>
          <header className="hair border-x-0 border-t-0 bg-paper/90 sticky top-0 z-40" style={{ paddingTop: "env(safe-area-inset-top)" }}>
            <div className="mx-auto flex max-w-wide items-center gap-4 px-4 py-3 sm:px-5 md:px-8">
              <Link href="/" className="flex items-center gap-2 font-head text-lg font-bold">
                <span aria-hidden className="inline-block h-3 w-3 rounded-full" style={{ background: "#1F6FEB" }} /> Meridian Atlas
              </Link>
              <nav className="ml-auto flex items-center gap-4 text-sm" aria-label="Primary">
                <Link href="/" className="hover:text-meridian">Atlas</Link>
                <Link href="/method" className="hover:text-meridian">Method</Link>
              </nav>
            </div>
          </header>
          <main id="main">{children}</main>
          <footer className="mx-auto max-w-wide px-4 py-8 sm:px-5 md:px-8">
            <div className="hair border-x-0 border-b-0 flex flex-col gap-2 pt-5 text-sm text-slate md:flex-row md:justify-between">
              <span className="font-head font-bold text-ink">Meridian Atlas <span className="label ml-1">GL-006</span></span>
              <span className="flex flex-wrap gap-x-5 gap-y-1">
                <span className="mono">{ENV.network}</span>
                <span className="mono break-all">{PREVIEW_MODE ? "no contract" : ENV.contractAddress}</span>
                <a href="https://docs.genlayer.com/" target="_blank" rel="noopener noreferrer" className="hover:text-meridian">Built on GenLayer</a>
              </span>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
