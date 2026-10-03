"use client";

import { useState } from "react";
import { useCountdown } from "@/lib/useCountdown";

const R = 29;
const C = 2 * Math.PI * R;

/** One round dial: the ring empties as the unit runs down, the digits sit in the middle. */
function Ring({ value, max, label }: { value: number; max: number; label: string }) {
  const [pair, setPair] = useState({ prev: value, cur: value });
  if (pair.cur !== value) setPair({ prev: pair.cur, cur: value });
  // when a unit wraps (59 -> 0 -> 59) the ring refills at once instead of sweeping backwards
  const refill = pair.cur > pair.prev;
  const frac = Math.min(value / max, 1);

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[54px] w-[54px] sm:h-[68px] sm:w-[68px]">
        <svg viewBox="0 0 68 68" className="h-full w-full -rotate-90" aria-hidden>
          <circle cx="34" cy="34" r={R} fill="rgba(255,255,255,.13)" stroke="rgba(255,255,255,.28)" strokeWidth="4" />
          <circle
            cx="34"
            cy="34"
            r={R}
            fill="none"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - frac)}
            style={{ transition: refill ? "none" : "stroke-dashoffset .9s linear", filter: "drop-shadow(0 0 4px rgba(255,255,255,.8))" }}
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center font-[family-name:var(--font-unbounded)] text-[15px] font-bold tabular-nums text-white sm:text-[19px]">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="mt-1.5 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-white/85">{label}</span>
    </div>
  );
}

export default function RingClock({ endsAt }: { endsAt: string }) {
  const parts = useCountdown(endsAt);
  const p = parts ?? { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return (
    <div
      role="timer"
      aria-label={`Offer ends in ${p.days} days ${p.hours} hours ${p.minutes} minutes`}
      className={`flex gap-2 transition-opacity duration-500 sm:gap-3.5 ${parts ? "opacity-100" : "opacity-0"}`}
    >
      <Ring value={p.days} max={7} label="Days" />
      <Ring value={p.hours} max={24} label="Hours" />
      <Ring value={p.minutes} max={60} label="Mins" />
      <Ring value={p.seconds} max={60} label="Secs" />
    </div>
  );
}
