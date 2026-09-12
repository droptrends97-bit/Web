import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import { site } from "@/lib/content";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Grain from "@/components/chrome/Grain";
import Nav from "@/components/chrome/Nav";
import ScrollProgress from "@/components/chrome/ScrollProgress";
import "./globals.css";

/* One family in two voices. The serif carries every display size; the sans
   carries everything anyone actually reads. No third face, no monospace —
   a mono caption on every label is a costume, not a decision. */
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const description =
  "A sixteen-person design and front-end studio in Bermondsey, London. Four or five projects a year, seen through from first sketch to last deploy.";

export const metadata: Metadata = {
  title: `${site.name} — ${site.what}, ${site.city}`,
  description,
  openGraph: {
    title: `${site.name} — ${site.what}, ${site.city}`,
    description,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0c0a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="relative min-h-screen bg-ink text-paper antialiased">
        {/* Everything sits inside SmoothScroll so the chrome inherits the same
            MotionConfig, and therefore the same reduced-motion behaviour. */}
        <SmoothScroll>
          <Grain />
          <ScrollProgress />
          <Nav />
          <main>{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
