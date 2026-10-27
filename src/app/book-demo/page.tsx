import type { Metadata } from "next";
import { CalendarCheck, CircleHelp, Settings2, Video } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PhoneFrame } from "@/components/device/PhoneFrame";
import { BookDemoForm } from "@/components/forms/BookDemoForm";
import { byId } from "@/config/screenshots";

export const metadata: Metadata = {
  title: "Book a Demo",
  description: "Book a tailored walkthrough of SOS: COMMUNITY APP for your organization or community.",
};

const benefits = [
  { icon: Video, title: "Live product walkthrough", copy: "See reporting, coordination, and status tracking in one guided session." },
  { icon: Settings2, title: "Tailored to your community", copy: "Focus the conversation on your team, processes, and response needs." },
  { icon: CircleHelp, title: "Q&A with the team", copy: "Bring your practical questions and leave with clear next steps." },
  { icon: CalendarCheck, title: "A time that works for you", copy: "Share your preferred schedule and we’ll confirm the best available slot." },
];

export default function BookDemoPage() {
  const screenshot = byId("hero-primary");

  return (
    <section className="relative overflow-hidden bg-paper py-[clamp(4rem,8vw,8rem)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_18%_12%,rgba(217,54,66,0.13),transparent_44%)]" />
      <Container className="relative grid gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(34rem,1.1fr)] lg:items-start lg:gap-20">
        <div className="lg:sticky lg:top-[calc(var(--nav-h)+3rem)]">
          <Eyebrow className="text-muted-light">A closer look at SOS</Eyebrow>
          <h1 className="mt-6 max-w-[11ch] text-[length:clamp(3rem,5.5vw,5.5rem)] text-text-dark">
            See SOS: COMMUNITY APP in Action
          </h1>
          <p className="mt-6 max-w-xl text-[length:var(--text-lead)] leading-relaxed text-muted-light">
            Get a focused walkthrough built around how your community reports, coordinates, and responds.
          </p>

          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            {benefits.map(({ icon: Icon, title, copy }) => (
              <li key={title} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                  <Icon aria-hidden="true" size={21} strokeWidth={1.7} />
                </span>
                <div>
                  <h2 className="text-base font-semibold tracking-normal">{title}</h2>
                  <p className="mt-1 max-w-md text-sm leading-relaxed text-muted-light">{copy}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-12 hidden items-end gap-6 xl:flex">
            <PhoneFrame screenshot={screenshot} slot="hero-primary" sizes="180px" className="w-[10.5rem] rotate-[-3deg]" />
            <p className="mb-5 max-w-[15rem] text-sm leading-relaxed text-muted-light">
              A practical look at the real reporting experience—from first alert to coordinated follow-through.
            </p>
          </div>
        </div>

        <div className="rounded-[var(--radius-card)] border border-paper-line bg-white p-[clamp(1.25rem,4vw,3rem)] shadow-[0_30px_80px_-40px_rgba(16,19,24,0.35)]">
          <div className="mb-8 border-b border-paper-line pb-7">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">Request a demo</p>
            <h2 className="mt-3 text-[length:clamp(1.75rem,3vw,2.5rem)]">Tell us about your team</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-light">All fields are required unless marked optional.</p>
          </div>
          <BookDemoForm />
        </div>
      </Container>
    </section>
  );
}
