"use client";

import { useEffect, useRef, useState } from "react";
import { useCountdown } from "@/lib/useCountdown";

const SIZES = {
  md: { card: "h-[70px] w-[58px] sm:h-[86px] sm:w-[74px]", digit: "text-[34px] sm:text-[44px]", sep: "text-[26px] sm:text-[34px] pt-3.5 sm:pt-[18px]" },
  sm: { card: "h-[62px] w-[52px]", digit: "text-[30px]", sep: "text-[24px] pt-3" },
};

function FlipCard({ value, size }: { value: string; size: keyof typeof SIZES }) {
  const [shown, setShown] = useState(value);
  const [flipping, setFlipping] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      setShown(value);
      return;
    }
    setFlipping(false);
    const start = requestAnimationFrame(() => setFlipping(true));
    const swap = setTimeout(() => setShown(value), 260);
    const end = setTimeout(() => setFlipping(false), 580);
    return () => {
      cancelAnimationFrame(start);
      clearTimeout(swap);
      clearTimeout(end);
    };
  }, [value]);

  return (
    <div className={`flip-card ${SIZES[size].card} ${flipping ? "flipping" : ""}`}>
      <span className={SIZES[size].digit}>{shown}</span>
    </div>
  );
}

export default function FlipClock({
  endsAt,
  size = "md",
}: {
  endsAt: string;
  size?: keyof typeof SIZES;
}) {
  const parts = useCountdown(endsAt);
  const p = parts ?? { days: 0, hours: 0, minutes: 0, seconds: 0 };
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
      className={`flex gap-2 transition-opacity duration-500 [perspective:600px] sm:gap-2.5 ${
        parts ? "opacity-100" : "opacity-0"
      }`}
    >
      {units.map((u, i) => (
        <div key={u.label} className="flex gap-2 sm:gap-2.5">
          <div className="flex flex-col items-center gap-2">
            <FlipCard value={String(u.v).padStart(2, "0")} size={size} />
            <span className="text-[10px] uppercase tracking-[0.26em] text-white/40">
              {u.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className={`${SIZES[size].sep} leading-none text-white/25`}>:</span>
          )}
        </div>
      ))}
    </div>
  );
}
