import { ImageResponse } from "next/og";

// Generated placeholder favicon — a generic monogram mark, not a real logo. Replace
// with a real icon derived from assets/brand-raw/app-icon.png once supplied (see
// docs/assets-guide.md); this file can then be deleted in favor of a static
// public/brand/favicon.* referenced from metadata, or simply swapped for the real
// artwork.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#101318",
          borderRadius: 6,
        }}
      >
        <span style={{ color: "#D93642", fontSize: 20, fontWeight: 700 }}>S</span>
      </div>
    ),
    { ...size },
  );
}
