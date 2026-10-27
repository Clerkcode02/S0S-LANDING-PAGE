// Intro splash coordination. Shared by IntroSplash (which plays it), the reveal
// observer, and the hero phone (both of which must not start until it's over).
//
// The actual *visibility* decision is NOT made here — it's made by a tiny inline
// script in src/app/layout.tsx that stamps `data-intro` on <html> before first paint.
// That ordering matters: it means no-JS visitors never get a stuck overlay, returning
// visitors never see a flash of it, and first-time visitors never see a flash of the
// page before it. This module only reads that attribute back and lets other
// components await the end of the sequence.

/** Single switch. Set to false to disable the intro everywhere, permanently. */
export const INTRO_ENABLED = true;

/** Timing, in seconds. Keep the total near 3s — it's a brand beat, not a loader. */
export const INTRO_TIMING = {
  markIn: 0.6,
  ringStagger: 0.45,
  wordStart: 0.7,
  letterStagger: 0.08,
  subStart: 1.3,
  /** When the device brightens and settles. Overlaps the rings and the wordmark
   *  on purpose: it keeps the whole sequence inside the ~3s budget, and the device
   *  is already faintly painted before this (see .intro-device in globals.css). */
  deviceStart: 0.5,
  hold: 0.5,
  exit: 0.8,
  /** Reduced-motion path: a single quick fade, no sequence. */
  reducedFade: 0.35,
  reducedHold: 0.35,
} as const;

export const INTRO_SESSION_KEY = "sos:intro-played";

type Mode = "play" | "quick" | null;

let settled = false;
const waiters = new Set<() => void>();

/** What the pre-paint inline script decided. Null = the intro is not running. */
export function introMode(): Mode {
  if (typeof document === "undefined") return null;
  const value = document.documentElement.getAttribute("data-intro");
  return value === "play" || value === "quick" ? value : null;
}

/** True once the intro is over, or if it was never going to run at all. */
export function introSettled(): boolean {
  return settled || introMode() === null;
}

/**
 * Run `cb` when the intro finishes. Fires synchronously if the intro isn't running
 * (returning visitor, no JS, intro disabled), so callers need no branching of their
 * own. Returns an unsubscribe for effect cleanup.
 */
export function onIntroDone(cb: () => void): () => void {
  if (introSettled()) {
    cb();
    return () => {};
  }
  waiters.add(cb);
  return () => waiters.delete(cb);
}

/** Called once by IntroSplash when the exit transition completes (or is skipped). */
export function markIntroDone(): void {
  if (settled) return;
  settled = true;
  document.documentElement.removeAttribute("data-intro");
  document.documentElement.classList.remove("intro-lock");
  const pending = [...waiters];
  waiters.clear();
  for (const cb of pending) cb();
}

/** Remembered as soon as the intro starts, so a reload mid-sequence doesn't replay it. */
export function rememberIntroPlayed(): void {
  try {
    sessionStorage.setItem(INTRO_SESSION_KEY, "1");
  } catch {
    // Private mode / storage disabled — the intro simply plays again next load.
  }
}
