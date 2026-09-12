import type { Metadata, Viewport } from "next";
import { Inter_Tight, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { site } from "@/lib/content";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Cursor from "@/components/chrome/Cursor";
import Grain from "@/components/chrome/Grain";
import Nav from "@/components/chrome/Nav";
import Preloader from "@/components/chrome/Preloader";
import ScrollProgress from "@/components/chrome/ScrollProgress";
import "./globals.css";

/* A trio with deliberate contrast: a tight grotesque for the mega display
   sizes, a high-contrast serif for the italic accents, and a mono for every
   technical label on the page. */
const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description:
    "Interface engineering and motion design for companies who refuse to look like everyone else.",
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description:
      "Interface engineering and motion design for companies who refuse to look like everyone else.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#06050a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${instrument.variable} ${jetbrains.variable}`}
    >
      <body className="relative min-h-screen bg-void text-bone antialiased">
        {/* Everything lives inside SmoothScroll so the chrome inherits the same
            MotionConfig (and therefore the same reduced-motion behaviour). */}
        <SmoothScroll>
          <Preloader />
          <Grain />
          <ScrollProgress />
          <Cursor />
          <Nav />
          <main>{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
