import Image from "next/image";
import type { ReactNode, Ref } from "react";
import type { Screenshot, Slot } from "@/config/screenshots";
import { ScreenshotPlaceholder } from "./ScreenshotPlaceholder";

interface PhoneFrameProps {
  /** React 19 passes `ref` as an ordinary prop to function components. */
  ref?: Ref<HTMLDivElement>;
  screenshot: Screenshot;
  slot: Slot;
  priority?: boolean;
  sizes?: string;
  dynamicIsland?: boolean;
  className?: string;
  /** Replaces the single default screenshot — used by PhoneShowcase to stack screens. */
  screen?: ReactNode;
  /** Rendered above the screen, inside the frame (tap cursor, glass sweep). */
  overlay?: ReactNode;
  /** Bezel sheen + side buttons. Hero-grade chrome; off by default so the How It
   * Works rail and the showcase gallery stay as light as they are today. */
  chrome?: boolean;
}

/**
 * Pure-CSS phone frame — no PNG device mockups. Renders a real screenshot via
 * next/image when available, otherwise an honest ScreenshotPlaceholder at the same
 * aspect ratio. See .claude/skills/app-screenshot-showcase/SKILL.md ("PhoneFrame
 * component").
 *
 * `chrome` adds the premium hero treatment: a static bezel sheen, two side-button
 * nubs, and a deeper layered shadow. All of it is static — per
 * .claude/skills/lightweight-motion only transform/opacity ever animate, so
 * box-shadow and gradients are painted once and left alone.
 */
export function PhoneFrame({
  ref,
  screenshot,
  slot,
  priority = false,
  sizes = "(min-width: 1024px) 320px, 70vw",
  dynamicIsland = true,
  className = "",
  screen,
  overlay,
  chrome = false,
}: PhoneFrameProps) {
  const showPlaceholder = !screenshot.src || !screenshot.privacyChecked;

  // Two stacked shadows when `chrome` is on: a tight contact shadow plus a wide
  // ambient one, which is what reads as "sitting in real light" rather than
  // "floating on a single blur".
  const shadow = chrome
    ? "shadow-[0_1px_0_0_rgba(255,255,255,0.14)_inset,0_2px_6px_-1px_rgba(0,0,0,0.5),0_44px_90px_-28px_rgba(0,0,0,0.75)]"
    : "shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset,0_30px_60px_-20px_rgba(0,0,0,0.55)]";

  return (
    <div
      ref={ref}
      className={`relative rounded-[var(--radius-phone)] bg-ink-raised p-2.5 ${shadow} ${className}`}
    >
      {chrome && (
        <>
          {/* Side buttons sit outside the frame's padding box, so this wrapper can't
            * be overflow-hidden — the screen element below clips the image instead. */}
          <span aria-hidden="true" className="phone-side-button left-[-2px] top-[18%] h-[7%]" />
          <span aria-hidden="true" className="phone-side-button right-[-2px] top-[24%] h-[12%]" />
        </>
      )}

      <div className="relative overflow-hidden rounded-[calc(var(--radius-phone)-0.6rem)] bg-ink ring-1 ring-inset ring-white/5">
        {dynamicIsland && (
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-ink"
          />
        )}

        {screen ??
          (showPlaceholder ? (
            <ScreenshotPlaceholder
              slot={slot}
              width={screenshot.width}
              height={screenshot.height}
            />
          ) : (
            <Image
              src={screenshot.src as string}
              alt={screenshot.alt}
              width={screenshot.width}
              height={screenshot.height}
              sizes={sizes}
              priority={priority}
              fetchPriority={priority ? "high" : undefined}
              loading={priority ? undefined : "lazy"}
              className="h-auto w-full"
            />
          ))}

        {overlay}
        {chrome && <span aria-hidden="true" className="phone-bezel-sheen" />}
      </div>
    </div>
  );
}
