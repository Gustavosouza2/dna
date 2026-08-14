/**
 * Canonical origin of the site, single source for metadataBase,
 * sitemap.ts and robots.ts.
 *
 * Read at BUILD time, not at runtime: sitemap.xml/robots.txt are
 * statically prerendered and `metadataBase` is baked into the HTML, so
 * NEXT_PUBLIC_SITE_URL has to be set before `next build` — changing it
 * only on the running server has no effect.
 *
 * No fallback to a guessed domain: a wrong absolute URL in canonical/
 * og:url/sitemap is worse than a build that fails loudly. Locally
 * .env.local supplies http://localhost:3000.
 */
function resolveSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL

  if (!raw) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL não definida. Defina-a no ambiente de build (ex.: https://www.dnaircargo.com.br) — ela alimenta canonical, Open Graph, sitemap.xml e robots.txt."
    )
  }

  // Trailing slash would produce "https://site.com//services" when
  // concatenated in sitemap.ts.
  return raw.replace(/\/+$/, "")
}

export const SITE_URL = resolveSiteUrl()
