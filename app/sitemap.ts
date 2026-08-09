import type { MetadataRoute } from "next";

// TODO: confirm the final production domain with the client.
// Inferred from contato@dnaircargo.com.br — may not be the site's real
// domain. Configurable via NEXT_PUBLIC_SITE_URL without touching this file.
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dnaircargo.com.br";

const ROUTES = [
  "",
  "/services",
  "/services/air",
  "/services/road",
  "/services/river",
  "/quote",
  "/contact",
  "/about",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));
}
