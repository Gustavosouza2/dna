import { ImageResponse } from "next/og";

import { SITE_NAME } from "@/lib/constants";

/**
 * Social sharing card, generated at build time.
 *
 * Built instead of reusing a photo from /public: the existing hero is a
 * 1920x1920 square weighing ~600KB — wrong aspect ratio for the 1.91:1
 * OG slot (crawlers crop it) and needlessly heavy. This renders a
 * brand-coloured 1200x630 card with no runtime cost.
 */
export const alt = `${SITE_NAME} — Transporte aéreo, rodoviário e fluvial`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BRAND_BLUE = "#2B4FE0";
const NAVY = "#0E1A33";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: NAVY,
          padding: 80,
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              background: BRAND_BLUE,
            }}
          />
          <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: -0.5 }}>{SITE_NAME}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.1, letterSpacing: -2 }}>
            Transporte aéreo, rodoviário e fluvial
          </div>
          <div style={{ fontSize: 30, color: "#8A93A6" }}>
            Soluções completas em logística de cargas em todo o Brasil
          </div>
        </div>

        <div style={{ display: "flex", height: 10, borderRadius: 5, background: BRAND_BLUE }} />
      </div>
    ),
    size
  );
}
