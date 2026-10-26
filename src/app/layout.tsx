import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { SkipLink } from "@/components/layout/SkipLink";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: site.seo.title,
    template: `%s — ${site.shortName}`,
  },
  description: site.seo.description,
  // No explicit `images` array here on purpose — src/app/opengraph-image.tsx (file
  // convention) generates the OG/Twitter image automatically. Once a real
  // assets/brand-raw/og-image.png is supplied, replace that file with the static
  // asset per docs/assets-guide.md and this block keeps working unchanged.
  openGraph: {
    title: site.seo.title,
    description: site.seo.description,
    url: siteUrl,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${inter.variable} no-js h-full antialiased`}
    >
      <head>
        {/* Removes the no-js fallback class before first paint if JS runs. See
            .claude/skills/lightweight-motion/SKILL.md ("Reveal pattern"). */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.remove('no-js');",
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-paper text-text-dark">
        <SkipLink />
        <Nav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
