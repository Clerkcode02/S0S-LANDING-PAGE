import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      // No `lastModified` — a real build timestamp isn't available here, and an
      // Unix-epoch placeholder is worse than omitting the field. Add a real one if a
      // CI build step exposes a trustworthy date.
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
