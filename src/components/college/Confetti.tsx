"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

const COLORS = ["#ffffff", "#ffd23f", "#ff8ad8", "#67e8f9", "#b9ff66", "#ffb347"];

/** One-shot confetti burst. Change `burst` (e.g. increment it) to fire again. */
export default function Confetti({ burst, count = 46 }: { burst: number; count?: number }) {
  const reduce = useReducedMotion();
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        // Deterministic per burst so React keys stay stable within one burst.
        const seed = Math.sin((burst + 1) * 999 + i * 7.31) * 10000;
        const r = (n: number) => {
          const v = Math.sin(seed + n) * 10000;
          return v - Math.floor(v);
        };
        const angle = r(1) * Math.PI * 2;
        const speed = 160 + r(2) * 260;
        return {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed - 120,
          rotate: (r(3) - 0.5) * 720,
          color: COLORS[Math.floor(r(4) * COLORS.length)],
          w: 6 + r(5) * 6,
          h: 10 + r(6) * 8,
          round: r(7) > 0.7,
          delay: r(8) * 0.08,
        };
      }),
    [burst, count]
  );

  if (burst === 0 || reduce) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 z-30 h-0 w-0">
      {pieces.map((p, i) => (
        <motion.span
          key={`${burst}-${i}`}
          className="absolute block"
          style={{ width: p.w, height: p.round ? p.w : p.h, background: p.color, borderRadius: p.round ? "50%" : 2 }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.6 }}
          animate={{ x: [0, p.x, p.x * 1.1], y: [0, p.y, p.y + 260], opacity: [1, 1, 0], rotate: p.rotate, scale: 1 }}
          transition={{ duration: 1.6, delay: p.delay, times: [0, 0.4, 1], ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
