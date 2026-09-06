import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SITE_URL } from "../lib/seo";

const TITLE = "East Coast Digital — Websites for Irish Businesses";
const DESCRIPTION =
  "We build fast, clean websites for Irish businesses. €500 to build, live within a week. Based on Ireland's east coast, working nationwide.";
const OG_IMAGE = `${SITE_URL}/og.png`;

/* Tells Google this is a real business rather than an unattributed page.
   Rendered into the document so crawlers and AI summaries can read it. */
const ORGANISATION = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#organisation`,
      name: "East Coast Digital",
      alternateName: "EastCoast Digital",
      description: DESCRIPTION,
      url: SITE_URL,
      image: OG_IMAGE,
      email: "hello@eastcoastdigital.ie",
      telephone: "+353874283438",
      priceRange: "€€",
      currenciesAccepted: "EUR",
      serviceType: "Web design and development",
      slogan: "Your business deserves a website that doesn't embarrass you.",
      address: {
        "@type": "PostalAddress",
        addressCountry: "IE",
      },
      areaServed: {
        "@type": "Country",
        name: "Ireland",
      },
      knowsAbout: [
        "Web design",
        "Web development",
        "Small business websites",
        "Website hosting",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Website builds",
        itemListElement: [
          {
            "@type": "Offer",
            name: "A complete website",
            description:
              "A custom-designed website for a small or medium Irish business, live within a week.",
            price: "500",
            priceCurrency: "EUR",
            url: `${SITE_URL}/pricing`,
          },
          {
            "@type": "Offer",
            name: "Hosting, updates and support",
            description:
              "Hosting, SSL, backups and small content changes on request. No contract.",
            price: "30",
            priceCurrency: "EUR",
            url: `${SITE_URL}/pricing`,
          },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "East Coast Digital",
      inLanguage: "en-IE",
      publisher: { "@id": `${SITE_URL}/#organisation` },
    },
  ],
};

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "google-site-verification", content: "EA_6TWmDr4Otmt0cxhg0wkMRl70LHkxKgwCxzVAvHHs" },
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "author", content: "East Coast Digital" },
      { name: "theme-color", content: "#0E2233" },
      { property: "og:site_name", content: "East Coast Digital" },
      { property: "og:locale", content: "en_IE" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "East Coast Digital — websites for Irish businesses" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: `${SITE_URL}/` },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", href: "/icon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800;900&family=Work+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IE">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANISATION) }}
        />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
