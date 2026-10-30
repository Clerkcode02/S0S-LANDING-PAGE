"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { sosSimulation } from "@/content/sosSimulation";

export type SimulationPhase = "idle" | "holding" | "received";
export type ProcessingStatus = "pending" | "processing" | "dispatched";

export function useSosSimulation() {
  const [phase, setPhase] = useState<SimulationPhase>("idle");
  const [countdown, setCountdown] = useState(3);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>("pending");
  const holdActiveRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  const clearHoldTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const prepareAudio = useCallback(() => {
    try {
      const AudioContextClass = window.AudioContext;
      const context = audioContextRef.current ?? new AudioContextClass();
      audioContextRef.current = context;
      void context.resume();
    } catch {
      // Audio is an enhancement; simulation remains fully functional without it.
    }
  }, []);

  const playNotification = useCallback(() => {
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
      // Browser autoplay policy might reject; visual indicators suffice.
    });
  }, []);

  const completeHold = useCallback(() => {
    if (!holdActiveRef.current) return;
    holdActiveRef.current = false;
    clearHoldTimers();
    setPhase("received");
    setProcessingStatus("pending");
    playNotification();
  }, [clearHoldTimers, playNotification]);

  const beginHold = useCallback(() => {
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
  }, [completeHold, phase, prepareAudio]);

  const cancelHold = useCallback(() => {
    if (!holdActiveRef.current) return;
    holdActiveRef.current = false;
    clearHoldTimers();
    setCountdown(3);
    setPhase("idle");
  }, [clearHoldTimers]);

  const dismissReport = useCallback(() => {
    clearHoldTimers();
    holdActiveRef.current = false;
    setCountdown(3);
    setPhase("idle");
    setProcessingStatus("pending");
  }, [clearHoldTimers]);

  const processReport = useCallback(() => {
    setProcessingStatus("processing");
    window.setTimeout(() => {
      setProcessingStatus("dispatched");
    }, 900);
  }, []);

  useEffect(() => {
    return () => {
      holdActiveRef.current = false;
      clearHoldTimers();
      const context = audioContextRef.current;
      if (context) void context.close();
    };
  }, [clearHoldTimers]);

  const holdLabel =
    phase === "holding"
      ? `${sosSimulation.holding} · ${countdown}`
      : phase === "received"
        ? sosSimulation.received
        : sosSimulation.instruction;

  return {
    phase,
    countdown,
    processingStatus,
    holdLabel,
    beginHold,
    cancelHold,
    completeHold,
    dismissReport,
    processReport,
  };
}

