import { ImageResponse } from "next/og";
import { site } from "@/content/site";

// Generated placeholder OG/Twitter share image (text-only brand card) — not a real
// screenshot or logo. Replace with a real assets/brand-raw/og-image.png once supplied;
// see docs/assets-guide.md.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#101318",
        }}
      >
        <div style={{ width: 48, height: 3, background: "#D93642", marginBottom: 28 }} />
        <div style={{ color: "#9AA2AD", fontSize: 22, letterSpacing: 2, textTransform: "uppercase" }}>
          Community Safety, Connected
        </div>
        <div style={{ color: "#F7F8FA", fontSize: 64, fontWeight: 700, marginTop: 20, lineHeight: 1.05 }}>
          {site.name}
        </div>
        <div style={{ color: "#9AA2AD", fontSize: 26, marginTop: 24, maxWidth: 900 }}>
          {site.seo.description}
        </div>
      </div>
    ),
    { ...size },
  );
}
