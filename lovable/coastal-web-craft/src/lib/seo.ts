export const SITE_URL = "https://eastcoastdigital.ie";

/** Per-page title, description, canonical and Open Graph, in one place. */
export function pageHead({
  path,
  title,
  description,
}: {
  path: string;
  title: string;
  description: string;
}) {
  const url = `${SITE_URL}${path}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
