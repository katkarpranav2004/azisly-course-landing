"use client";

import { useMemo, useSyncExternalStore } from "react";

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

function partsFor(endsAt: string, now: number): CountdownParts {
  const totalMs = Math.max(new Date(endsAt).getTime() - now, 0);
  return {
    days: Math.floor(totalMs / 86_400_000),
    hours: Math.floor((totalMs % 86_400_000) / 3_600_000),
    minutes: Math.floor((totalMs % 3_600_000) / 60_000),
    seconds: Math.floor((totalMs % 60_000) / 1_000),
    totalMs,
  };
}

function subscribe(onTick: () => void) {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
}
const getSecond = () => Math.floor(Date.now() / 1000);
const getServerSecond = () => null;

/** Returns null on the server and during hydration so markup matches, then ticks every second. */
export function useCountdown(endsAt: string): CountdownParts | null {
  const second = useSyncExternalStore(subscribe, getSecond, getServerSecond);
  return useMemo(() => (second === null ? null : partsFor(endsAt, second * 1000)), [second, endsAt]);
}
