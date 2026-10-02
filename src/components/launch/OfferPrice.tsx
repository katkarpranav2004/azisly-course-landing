"use client";

import { motion } from "framer-motion";
import type { PricingConfig } from "@/content/types";

const SIZES = {
  xl: { price: "text-[clamp(60px,7.5vw,96px)]", strike: "text-xl", badge: "text-[15px] px-3 py-1.5" },
  lg: { price: "text-[clamp(52px,5vw,64px)]", strike: "text-lg", badge: "text-[13px] px-2.5 py-1" },
};

const VARIANTS = {
  launch: {
    burst: "bg-[radial-gradient(closest-side,rgba(92,124,255,.7),transparent)]",
    breathe: "bg-[radial-gradient(closest-side,rgba(124,92,255,.5),transparent)]",
    price: "text-white [text-shadow:0_0_40px_rgba(99,132,255,.55)]",
    badge: "bg-[#ff2e63] text-white shadow-[0_10px_30px_-8px_rgba(255,46,99,.9)]",
    strike: "text-muted",
    line: "bg-[#ff4d6d]",
    note: "text-muted",
  },
  sunset: {
    burst: "bg-[radial-gradient(closest-side,rgba(255,255,255,.75),transparent)]",
    breathe: "bg-[radial-gradient(closest-side,rgba(255,220,240,.5),transparent)]",
    price: "font-[family-name:var(--font-unbounded)] text-white [text-shadow:0_0_40px_rgba(255,255,255,.5)]",
    badge: "bg-white text-[#c2185b] shadow-[0_10px_30px_-8px_rgba(255,255,255,.9)] font-[family-name:var(--font-unbounded)]",
    strike: "text-white/75",
    line: "bg-white",
    note: "text-white/85",
  },
};

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** Price reveal: strike-through draws, ₹ price bursts in with a glow, discount badge pops, then the glow breathes. */
export default function OfferPrice({
  pricing,
  size = "lg",
  delay = 0.2,
  variant = "launch",
}: {
  pricing: PricingConfig;
  size?: keyof typeof SIZES;
  delay?: number;
  variant?: keyof typeof VARIANTS;
}) {
  const off = Math.round((1 - pricing.offerPrice / pricing.listPrice) * 100);
  const s = SIZES[size];
  const v = VARIANTS[variant];
  const view = { once: true, margin: "-40px" } as const;

  return (
    <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
      <div className="relative">
        <motion.span
          aria-hidden
          className={`pointer-events-none absolute -inset-x-8 -inset-y-6 rounded-full blur-xl ${v.burst}`}
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: [0, 1, 0], scale: [0.5, 1.25, 1] }}
          viewport={view}
          transition={{ delay: delay + 0.45, duration: 1.2, times: [0, 0.35, 1] }}
        />
        <motion.span
          aria-hidden
          className={`pointer-events-none absolute -inset-x-6 -inset-y-4 rounded-full blur-xl ${v.breathe}`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: [0.25, 0.6] }}
          viewport={view}
          transition={{ delay: delay + 1.6, duration: 2.6, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
        <motion.span
          className={`display relative block leading-[0.9] ${v.price} ${s.price}`}
          initial={{ opacity: 0, scale: 0.7, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, scale: [0.7, 1.1, 1], filter: "blur(0px)" }}
          viewport={view}
          transition={{ delay: delay + 0.4, duration: 0.85, times: [0, 0.6, 1], ease: [0.22, 1, 0.36, 1] }}
        >
          {inr(pricing.offerPrice)}
        </motion.span>
      </div>

      <div className="flex flex-col items-start gap-2 pb-1.5">
        <motion.span
          className={`whitespace-nowrap rounded-lg font-extrabold tracking-tight ${v.badge} ${s.badge}`}
          initial={{ scale: 0, rotate: -18 }}
          whileInView={{ scale: [0, 1.3, 1], rotate: -6 }}
          viewport={view}
          transition={{ delay: delay + 1.05, duration: 0.55, ease: "backOut" }}
        >
          {off}% OFF
        </motion.span>
        <motion.span
          className={`relative ${v.strike} ${s.strike}`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={view}
          transition={{ delay, duration: 0.3 }}
        >
          {inr(pricing.listPrice)}
          <motion.span
            aria-hidden
            className={`absolute left-[-4%] top-1/2 h-[2px] w-[108%] origin-left -rotate-6 rounded ${v.line}`}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={view}
            transition={{ delay: delay + 0.25, duration: 0.35, ease: "easeOut" }}
          />
        </motion.span>
        <span className={`text-[11px] font-medium uppercase tracking-[0.14em] ${v.note}`}>incl. GST</span>
      </div>
    </div>
  );
}
