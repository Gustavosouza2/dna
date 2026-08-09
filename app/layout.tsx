import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MotionProvider } from "@/components/motion/motion-provider";
import { CONTACT, SITE_NAME } from "@/lib/constants";

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

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Transporte aéreo, rodoviário e fluvial`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "Soluções completas em logística e transporte de cargas — aéreo, rodoviário e fluvial em todo o Brasil.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
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
      <body className="min-h-full flex flex-col">
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
