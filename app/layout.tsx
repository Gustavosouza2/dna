import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MotionProvider } from "@/components/motion/motion-provider";
import { CONTACT, SITE_NAME } from "@/lib/constants";
import { SITE_URL } from "@/lib/site";

// JetBrains Mono was removed (performance finding from the improvement
// sweep): it was being downloaded on every page with no real use on the
// site (only existed in the reference design-system.html).
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const SITE_TITLE = `${SITE_NAME} — Transporte aéreo, rodoviário e fluvial`;
const SITE_DESCRIPTION =
  "Soluções completas em logística e transporte de cargas — aéreo, rodoviário e fluvial em todo o Brasil.";

export const metadata: Metadata = {
  // Required for canonical/Open Graph URLs to come out absolute — without
  // it Next emits relative paths and social crawlers can't resolve them.
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE_NAME,
    url: "/",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    // Image comes from app/opengraph-image.tsx (auto-detected by Next).
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
    url: SITE_URL,
    telephone: CONTACT.phoneE164,
    email: CONTACT.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: CONTACT.addressLocality,
      addressRegion: CONTACT.addressRegion,
      addressCountry: CONTACT.addressCountry,
    },
    openingHours: "Mo-Fr 08:00-18:00",
  };

  return (
    <html
      lang="pt-BR"
      className={`${manrope.variable} ${inter.variable} h-full antialiased`}
    >
      {/*
        suppressHydrationWarning: extensões de navegador (ColorZilla, Grammarly
        etc.) injetam atributos como cz-shortcut-listen no <body> antes do
        React hidratar. É só neste elemento — não mascara mismatch dos filhos.
      */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <MotionProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
