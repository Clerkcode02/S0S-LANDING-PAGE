"use client";

import Image from "next/image";
import { ArrowDown, BellRing, Clock3, MapPin, Pointer, X } from "lucide-react";
import { byId } from "@/config/screenshots";
import { PhoneFrame } from "@/components/device/PhoneFrame";
import { Container } from "@/components/ui/Container";
import { sosSimulation } from "@/content/sosSimulation";
import { useSosSimulation } from "@/lib/motion/useSosSimulation";

const RESPONSE_SYSTEM_IMAGE = "/images/response-system/response-system.png";

/**
 * Full-page section demonstrating how the Mobile App and Response System work together.
 * The Mobile App is on the left; the Operations Center Response System is on the right.
 * Pressing and holding the SOS button for 3 seconds triggers the simulated emergency
 * transmission, alert receipt, map pinning, and dispatch workflow.
 */
export function AppResponseDemo() {
  const mobileScreen = byId("hero-primary");
  const {
    phase,
    countdown,
    processingStatus,
    holdLabel,
    beginHold,
    cancelHold,
    dismissReport,
    processReport,
  } = useSosSimulation();

  return (
    <section
      id="demo"
      aria-labelledby="demo-heading"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-ink py-[clamp(5rem,9vw,9rem)] text-text-light"
    >
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-15"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 40%, var(--color-accent) 0%, transparent 70%)",
        }}
      />

      {/* Main Section Title — Only main title per requirement */}
      <Container className="relative z-10 text-center">
        <h2
          id="demo-heading"
          className="text-center text-[length:var(--text-h2)] font-bold tracking-tight text-text-light"
        >
          Demo of the App and Response System.
        </h2>
      </Container>

      {/* Side-by-side layout: Mobile App on the left, Response System on the right */}
      <Container className="relative z-10 mt-10 max-w-[1360px] lg:mt-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          {/* LEFT: Mobile App */}
          <div className="flex flex-col items-center lg:col-span-5 xl:col-span-4">
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-dark">
              <span
                className={`size-2 rounded-full ${
                  phase === "holding"
                    ? "bg-accent animate-ping"
                    : phase === "received"
                      ? "bg-accent"
                      : "bg-emerald-500"
                }`}
              />
              <span>Citizen Mobile App</span>
            </div>

            <div className="w-[min(78vw,19.5rem)]">
              <PhoneFrame
                screenshot={mobileScreen}
                slot="hero-primary"
                chrome
                dynamicIsland={false}
                sizes="(min-width: 1024px) 310px, 78vw"
                overlay={
                  <div className="hero-sos-control">
                    {phase === "idle" ? (
                      <div
                        className="pointer-events-none absolute bottom-[15.5%] left-1/2 z-30 flex -translate-x-1/2 flex-col items-center"
                        style={{ animation: "demo-hold-bounce 1.8s ease-in-out infinite" }}
                        aria-hidden="true"
                      >
                        <div className="flex items-center gap-1.5 rounded-full border border-white/30 bg-accent px-3 py-1 text-[0.72rem] font-bold tracking-wide text-white shadow-[0_4px_18px_rgba(217,54,66,0.75)]">
                          <Pointer size={13} strokeWidth={2.4} className="rotate-[-20deg]" />
                          <span>Hold this</span>
                        </div>
                        <div className="mt-0.5 text-accent drop-shadow-[0_2px_6px_rgba(217,54,66,0.9)]">
                          <ArrowDown size={14} strokeWidth={3} />
                        </div>
                      </div>
                    ) : (
                      <span id="demo-sos-hint" className="hero-sos-hint" aria-hidden="true">
                        {holdLabel}
                      </span>
                    )}

                    <button
                      type="button"
                      className="hero-sos-hold-button"
                      data-phase={phase}
                      aria-label={holdLabel}
                      aria-describedby="demo-sos-hint"
                      disabled={phase === "received"}
                      onPointerDown={(event) => {
                        if (event.pointerType === "mouse" && event.button !== 0) return;
                        event.preventDefault();
                        event.currentTarget.setPointerCapture(event.pointerId);
                        beginHold();
                      }}
                      onPointerUp={cancelHold}
                      onPointerCancel={cancelHold}
                      onLostPointerCapture={cancelHold}
                      onKeyDown={(event) => {
                        if ((event.key === " " || event.key === "Enter") && !event.repeat) {
                          event.preventDefault();
                          beginHold();
                        }
                      }}
                      onKeyUp={(event) => {
                        if (event.key === " " || event.key === "Enter") {
                          event.preventDefault();
                          cancelHold();
                        }
                      }}
                      onBlur={cancelHold}
                      onContextMenu={(event) => event.preventDefault()}
                    >
                      <span aria-hidden="true" className="hero-sos-hold-ring" />
                    </button>
                  </div>
                }
              />
            </div>

            <p className="mt-4 max-w-[280px] text-center text-xs text-muted-dark">
              {phase === "idle" && "Press and hold the SOS button for 3 seconds to test the live emergency flow"}
              {phase === "holding" && `Holding SOS button · ${countdown} second${countdown === 1 ? "" : "s"} remaining`}
              {phase === "received" && "Emergency alert sent to the operations response system"}
            </p>
          </div>

          {/* RIGHT: Response System */}
          <div className="flex flex-col lg:col-span-7 xl:col-span-8">
            {/* Operations Console Window Header */}
            <div className="flex items-center justify-between rounded-t-[calc(var(--radius-card)+0.4rem)] border border-b-0 border-white/15 bg-ink-raised px-4 py-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="size-2.5 rounded-full bg-ink-line" />
                  <span className="size-2.5 rounded-full bg-ink-line" />
                  <span className="size-2.5 rounded-full bg-ink-line" />
                </div>
                <span className="ml-2 text-[0.8rem] font-semibold text-text-light/90">
                  Operations Center — Response System
                </span>
              </div>

              <div className="flex items-center gap-2 text-[0.75rem]">
                {phase === "idle" && (
                  <span className="inline-flex items-center gap-1.5 text-muted-dark">
                    <span className="size-2 rounded-full bg-emerald-500/80" />
                    Standby · Ready for Reports
                  </span>
                )}
                {phase === "holding" && (
                  <span className="inline-flex items-center gap-1.5 font-medium text-yellow-400">
                    <span className="size-2 rounded-full bg-yellow-400 animate-ping" />
                    Receiving Carrier Signal ({countdown}s)...
                  </span>
                )}
                {phase === "received" && (
                  <span className="inline-flex items-center gap-1.5 font-semibold text-accent animate-pulse">
                    <span className="size-2 rounded-full bg-accent animate-ping" />
                    Live Emergency Alert Active
                  </span>
                )}
              </div>
            </div>

            {/* Main Response System Monitor */}
            <div
              className="demo-system-response relative aspect-[16/10] w-full rounded-t-none rounded-b-[calc(var(--radius-card)+0.4rem)]"
              data-report={phase}
            >
              <Image
                src={RESPONSE_SYSTEM_IMAGE}
                alt="SOS Response System operations center with an incident map and monitoring panels."
                width={1642}
                height={958}
                sizes="(min-width: 1280px) 780px, (min-width: 1024px) 58vw, 95vw"
                className="h-full w-full object-cover"
              />

              <span aria-hidden="true" className="hero-system-response-shade" />

              {/* Map pin marker positioned on operations map */}
              <div className="hero-report-map-marker" aria-hidden="true">
                <span className="hero-report-map-ping" />
                <span className="hero-report-map-pin">
                  <MapPin size={17} strokeWidth={2.2} />
                </span>
                <span className="hero-report-map-label">{sosSimulation.popup.locationLabel}</span>
              </div>

              {/* Incoming Emergency Report Alert Modal */}
              <section
                className="hero-incoming-report"
                aria-label="Simulated incoming emergency report"
                aria-hidden={phase !== "received"}
              >
                <div aria-hidden="true" className="hero-incoming-report-signal">
                  <BellRing size={18} strokeWidth={1.7} />
                </div>
                <div className="hero-incoming-report-copy">
                  <p className="hero-incoming-report-eyebrow">{sosSimulation.popup.eyebrow}</p>
                  <h3 className="text-base font-bold text-text-light">{sosSimulation.popup.title}</h3>
                </div>
                <button
                  type="button"
                  className="hero-incoming-report-close"
                  onClick={dismissReport}
                  aria-label={sosSimulation.popup.dismissLabel}
                  tabIndex={phase === "received" ? 0 : -1}
                >
                  <X aria-hidden="true" size={16} strokeWidth={1.7} />
                </button>

                <div className="hero-incoming-report-body">
                  <p>{sosSimulation.popup.description}</p>
                  <div className="hero-incoming-report-meta">
                    <span>
                      <Clock3 aria-hidden="true" size={13} strokeWidth={1.8} />
                      {sosSimulation.popup.submitted}
                    </span>
                  </div>

                  {/* Processing Demonstration */}
                  <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                    <div className="hero-incoming-report-status">
                      <span
                        aria-hidden="true"
                        className={
                          processingStatus === "dispatched"
                            ? "!bg-emerald-500"
                            : processingStatus === "processing"
                              ? "!bg-blue-400"
                              : "!bg-status-pending"
                        }
                      />
                      <span className="text-[0.72rem] font-medium">
                        {processingStatus === "dispatched"
                          ? "Ongoing · Assigned & Responders En Route"
                          : processingStatus === "processing"
                            ? "Processing · Assigning Nearest Units..."
                            : sosSimulation.popup.status}
                      </span>
                    </div>

                    {processingStatus === "pending" && (
                      <button
                        type="button"
                        onClick={processReport}
                        className="rounded bg-accent px-2.5 py-1 text-[0.7rem] font-semibold text-white transition-colors hover:bg-accent-strong"
                      >
                        Process &amp; Assign
                      </button>
                    )}
                    {processingStatus === "processing" && (
                      <span className="text-[0.7rem] text-muted-dark animate-pulse">Assigning...</span>
                    )}
                    {processingStatus === "dispatched" && (
                      <span className="text-[0.7rem] font-semibold text-emerald-400">Unit #104 Dispatched</span>
                    )}
                  </div>

                  <small className="mt-2 block text-muted-dark">{sosSimulation.popup.soundNote}</small>
                </div>
              </section>
            </div>

            {/* Helper summary beneath CAD */}
            <div className="mt-3 flex items-center justify-between text-xs text-muted-dark">
              <span>Incident review, verification, responder assignment, and real-time CAD status tracking</span>
              {phase === "received" && (
                <button
                  type="button"
                  onClick={dismissReport}
                  className="text-xs text-accent underline underline-offset-2 hover:text-accent-strong"
                >
                  Reset Demo
                </button>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

