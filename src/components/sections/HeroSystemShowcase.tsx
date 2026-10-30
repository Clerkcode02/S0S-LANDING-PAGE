"use client";

import Image from "next/image";
import Link from "next/link";
import type { MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, BellRing, Clock3, MapPin, X } from "lucide-react";
import { byId } from "@/config/screenshots";
import { PhoneFrame } from "@/components/device/PhoneFrame";
import { sosSimulation } from "@/content/sosSimulation";

const RESPONSE_SYSTEM_IMAGE = "/images/response-system/response-system.png";
type SimulationPhase = "idle" | "holding" | "received";

function jumpToSection(event: MouseEvent<HTMLAnchorElement>, sectionId: string) {
  // Keep the anchor's normal behavior for new tabs and other modified clicks.
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  const target = document.getElementById(sectionId);
  if (!target) return;

  event.preventDefault();

  // These hero shortcuts should arrive immediately. Temporarily overriding the
  // root behavior avoids the site's global smooth scroll while preserving it
  // for every other in-page link.
  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.history.pushState(null, "", `#${sectionId}`);
  target.scrollIntoView({ block: "start" });
  root.style.scrollBehavior = previousScrollBehavior;
}

/**
 * A single hero scene that connects the citizen-facing mobile app to the
 * operations-center response system. Each layer is a real, independently
 * focusable link to the section that explains it in detail.
 */
export function HeroSystemShowcase() {
  const mobileScreen = byId("hero-primary");
  const [phase, setPhase] = useState<SimulationPhase>("idle");
  const [countdown, setCountdown] = useState(3);
  const holdActiveRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  const clearHoldTimers = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  };

  const prepareAudio = () => {
    try {
      const AudioContextClass = window.AudioContext;
      const context = audioContextRef.current ?? new AudioContextClass();
      audioContextRef.current = context;
      void context.resume();
    } catch {
      // The visual simulation remains fully functional when audio is unavailable.
    }
  };

  const playNotification = () => {
    const context = audioContextRef.current;
    if (!context) return;

    void context.resume().then(() => {
      const start = context.currentTime + 0.02;
      const notes = [880, 660, 880];

      notes.forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const noteStart = start + index * 0.16;
        const noteEnd = noteStart + 0.12;

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, noteStart);
        gain.gain.setValueAtTime(0.0001, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.18, noteStart + 0.018);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(noteStart);
        oscillator.stop(noteEnd + 0.02);
      });
    }).catch(() => {
      // Browsers may still decline playback; the interface explains this possibility.
    });
  };

  const completeHold = () => {
    if (!holdActiveRef.current) return;
    holdActiveRef.current = false;
    clearHoldTimers();
    setPhase("received");
    playNotification();
  };

  const beginHold = () => {
    if (phase !== "idle" || holdActiveRef.current) return;

    prepareAudio();
    holdActiveRef.current = true;
    setCountdown(3);
    setPhase("holding");
    timersRef.current = [
      window.setTimeout(() => setCountdown(2), 1_000),
      window.setTimeout(() => setCountdown(1), 2_000),
      window.setTimeout(completeHold, sosSimulation.holdDurationMs),
    ];
  };

  const cancelHold = () => {
    if (!holdActiveRef.current) return;
    holdActiveRef.current = false;
    clearHoldTimers();
    setCountdown(3);
    setPhase("idle");
  };

  const dismissReport = () => {
    clearHoldTimers();
    holdActiveRef.current = false;
    setCountdown(3);
    setPhase("idle");
  };

  useEffect(() => {
    return () => {
      holdActiveRef.current = false;
      clearHoldTimers();
      const context = audioContextRef.current;
      if (context) void context.close();
    };
  }, []);

  const holdLabel =
    phase === "holding"
      ? `${sosSimulation.holding} · ${countdown}`
      : phase === "received"
        ? sosSimulation.received
        : sosSimulation.instruction;

  return (
    <div className="hero-system-stage preserve-3d" aria-label="Explore the SOS platform">
      <div className="hero-system-response group" data-report={phase}>
        <Link
          href="#response-system"
          className="hero-system-response-media"
          aria-label="Explore the Response System"
          onClick={(event) => jumpToSection(event, "response-system")}
        >
          <Image
            src={RESPONSE_SYSTEM_IMAGE}
            alt="SOS Response System operations center with an incident map and monitoring panels."
            width={1642}
            height={958}
            sizes="(min-width: 1280px) 620px, (min-width: 1024px) 48vw, 92vw"
            fetchPriority="high"
            className="h-full w-full object-cover"
          />
          <span aria-hidden="true" className="hero-system-response-shade" />
          <span className="hero-system-label hero-system-label-response">
            <span>
              <small>Response System</small>
              How it works
            </span>
            <ArrowDownRight aria-hidden="true" size={18} strokeWidth={1.6} />
          </span>
        </Link>

        <div className="hero-report-map-marker" aria-hidden="true">
          <span className="hero-report-map-ping" />
          <span className="hero-report-map-pin">
            <MapPin size={17} strokeWidth={2.2} />
          </span>
          <span className="hero-report-map-label">{sosSimulation.popup.locationLabel}</span>
        </div>

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
            <h2>{sosSimulation.popup.title}</h2>
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
            <div className="hero-incoming-report-status">
              <span aria-hidden="true" />
              {sosSimulation.popup.status}
            </div>
            <small>{sosSimulation.popup.soundNote}</small>
          </div>
        </section>
      </div>

      <div className="hero-system-mobile group">
        <span className="hero-system-phone-float block">
          <PhoneFrame
            screenshot={mobileScreen}
            slot="hero-primary"
            priority
            chrome
            dynamicIsland={false}
            sizes="(min-width: 1024px) 220px, 42vw"
            overlay={
              <div className="hero-sos-control">
                <button
                  type="button"
                  className="hero-sos-hold-button"
                  data-phase={phase}
                  aria-label={holdLabel}
                  aria-describedby="hero-sos-hint"
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
                <span id="hero-sos-hint" className="hero-sos-hint" aria-hidden="true">
                  {holdLabel}
                </span>
              </div>
            }
          />
        </span>
        <Link
          href="#how-it-works"
          className="hero-system-label hero-system-label-mobile"
          aria-label="See how the SOS mobile app works"
          onClick={(event) => jumpToSection(event, "how-it-works")}
        >
          <span>
            <small>Citizen app</small>
            How it works
          </span>
          <ArrowDownRight aria-hidden="true" size={17} strokeWidth={1.6} />
        </Link>
      </div>

      <span aria-hidden="true" className="hero-system-signal hero-system-signal-one" />
      <span aria-hidden="true" className="hero-system-signal hero-system-signal-two" />
    </div>
  );
}
