import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dnaircargo.com.br";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Internal design system reference, not part of the
      // institutional site (docs/design-system.md).
      disallow: "/design-system.html",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
