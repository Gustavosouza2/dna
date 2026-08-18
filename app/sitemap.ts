import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

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
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));
}
