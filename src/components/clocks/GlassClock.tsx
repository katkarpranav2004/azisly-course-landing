"use client";

import { useState } from "react";
import { useCountdown } from "@/lib/useCountdown";

const SIZES = {
  md: {
    box: "h-[40px] sm:h-[50px]",
    digit: "text-[28px] leading-[40px] sm:text-[38px] sm:leading-[50px]",
    tile: "w-[70px] pb-2.5 pt-3 sm:w-[92px] sm:pb-3 sm:pt-4",
    gap: "gap-2 sm:gap-3",
  },
  sm: {
    box: "h-[32px]",
    digit: "text-[23px] leading-[32px]",
    tile: "w-[62px] pb-2 pt-2.5",
    gap: "gap-1.5",
  },
};

function RollingDigits({ value, size }: { value: string; size: keyof typeof SIZES }) {
  const [pair, setPair] = useState<{ prev: string | null; cur: string }>({
    prev: null,
    cur: value,
  });

  if (pair.cur !== value) setPair({ prev: pair.cur, cur: value });
  const s = SIZES[size];

  return (
    <div className={`relative w-full overflow-hidden text-center ${s.box}`}>
      {pair.prev !== null && (
        <span
          key={`o-${pair.prev}`}
          className={`slot-out absolute inset-x-0 font-[family-name:var(--font-unbounded)] font-bold ${s.digit}`}
        >
          {pair.prev}
        </span>
      )}
      <span
        key={`n-${pair.cur}`}
        className={`absolute inset-x-0 font-[family-name:var(--font-unbounded)] font-bold ${s.digit} ${
          pair.prev !== null ? "slot-in" : ""
        }`}
      >
        {pair.cur}
      </span>
    </div>
  );
}

export default function GlassClock({ endsAt, size = "md" }: { endsAt: string; size?: keyof typeof SIZES }) {
  const parts = useCountdown(endsAt);
  const p = parts ?? { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const s = SIZES[size];
  const units = [
    { label: "Days", v: p.days },
    { label: "Hours", v: p.hours },
    { label: "Mins", v: p.minutes },
    { label: "Secs", v: p.seconds },
  ];

  return (
    <div
      role="timer"
      aria-label={`Offer ends in ${p.days} days ${p.hours} hours ${p.minutes} minutes`}
      className={`flex transition-opacity duration-500 ${s.gap} ${parts ? "opacity-100" : "opacity-0"}`}
    >
      {units.map((u) => (
        <div key={u.label} className={`glass-tile flex flex-col items-center ${s.tile}`}>
          <RollingDigits value={String(u.v).padStart(2, "0")} size={size} />
          <span className="mt-1 text-[9.5px] font-semibold uppercase tracking-[0.2em] text-white/80">{u.label}</span>
        </div>
      ))}
    </div>
  );
}
