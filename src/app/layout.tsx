import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { SkipLink } from "@/components/layout/SkipLink";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { IntroSplash } from "@/components/motion/IntroSplash";
import { INTRO_ENABLED, INTRO_SESSION_KEY } from "@/lib/motion/intro";

// Why these weight declarations look asymmetric — measured, see
// docs/performance-checklist.md (2026-10-27 font pass):
//
// A single `weight` string makes next/font fetch a STATIC instance; an array makes it
// fetch the VARIABLE font, which covers every weight in one file but costs about
// twice as much (basic-latin subset: 22KB static vs 44-47KB variable).
//
// Inter Tight is only ever used at 700 (h1/h2/h3 and the intro wordmark — nothing in
// the codebase asks the display family for 600), so a static instance is a pure win
// and it's the LCP element's font.
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
  weight: "700",
});

// Inter genuinely needs three weights: 400 (body), 500 (`font-medium`), and 600
// (`font-semibold`, 16 call sites). Three static instances would be ~69KB against
// ~47KB for the one variable file, so the variable font wins here. 600 is listed
// deliberately: it was missing before, so every `font-semibold` on body copy was
// being synthetically emboldened by the browser. Adding it costs zero extra bytes
// (one variable file serves all three) and renders the real weight.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
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
      suppressHydrationWarning
    >
      <head>
        {/* Runs before first paint, so the page never flashes the wrong state.
            1. Removes the no-js fallback class if JS runs. See
               .claude/skills/lightweight-motion/SKILL.md ("Reveal pattern").
            2. Decides whether the intro splash plays and stamps `data-intro` +
               `intro-lock` on <html>. Doing it here rather than in React is what
               keeps the three paths flash-free: no-JS visitors never get a stuck
               overlay, returning visitors never glimpse it, and first-time
               visitors never glimpse the page behind it. See
               src/lib/motion/intro.ts and docs/animation-spec.md. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.remove('no-js');
${INTRO_ENABLED ? `try{if(sessionStorage.getItem('${INTRO_SESSION_KEY}')!=='1'){var d=document.documentElement;d.setAttribute('data-intro',matchMedia('(prefers-reduced-motion: reduce)').matches?'quick':'play');d.classList.add('intro-lock');}}catch(e){}` : ""}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-paper text-text-dark">
        <SkipLink />
        {/* Sibling of <main>, never a wrapper — the page renders and loads
            underneath the splash the whole time. */}
        <IntroSplash />
        <Nav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
