import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Internal design system reference, not part of the
      // institutional site (docs/design-system.md).
      disallow: "/design-system.html",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
