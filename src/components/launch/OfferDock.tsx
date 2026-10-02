"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Timer } from "lucide-react";
import { useCountdown } from "@/lib/useCountdown";
import type { PricingConfig } from "@/content/types";
import type { OfferZone } from "./useOfferZone";

type Variant = "pill-danger" | "pill" | "bar" | "glass" | "corner" | "side";

const ZONE_VARIANT: Record<OfferZone, Variant | null> = {
  hero: null,
  pain: "pill-danger",
  transform: "pill",
  benefits: "bar",
  proof: "glass",
  experts: "corner",
  modules: "side",
  faq: "bar",
  final: null,
};

const pad = (n: number) => String(n).padStart(2, "0");

function useClock(endsAt: string) {
  const p = useCountdown(endsAt);
  if (!p) return { d: "--", hms: "--:--:--", parts: null };
  return { d: `${pad(p.days)}d`, hms: `${pad(p.hours)}:${pad(p.minutes)}:${pad(p.seconds)}`, parts: p };
}

const OFF = (p: PricingConfig) => Math.round((1 - p.offerPrice / p.listPrice) * 100);
const INR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function OffBadge({ pricing, className = "" }: { pricing: PricingConfig; className?: string }) {
  return (
    <span className={`rounded-md bg-[#ff2e63] px-1.5 py-0.5 text-[11px] font-extrabold text-white ${className}`}>
      {OFF(pricing)}% OFF
    </span>
  );
}

const enter = {
  "pill-danger": { initial: { y: -40, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: -40, opacity: 0 } },
  pill: { initial: { y: -40, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: -40, opacity: 0 } },
  bar: { initial: { y: 60, opacity: 0, scale: 0.96 }, animate: { y: 0, opacity: 1, scale: 1 }, exit: { y: 60, opacity: 0 } },
  glass: { initial: { x: 40, opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: 40, opacity: 0 } },
  corner: { initial: { scale: 0.6, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.6, opacity: 0 } },
  side: { initial: { x: 60, opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: 60, opacity: 0 } },
} as const;

export default function OfferDock({
  zone,
  pricing,
  onEnroll,
  hidden,
  mobile,
}: {
  zone: OfferZone;
  pricing: PricingConfig;
  onEnroll: () => void;
  hidden: boolean;
  mobile: boolean;
}) {
  const clock = useClock(pricing.offerEndsAt);
  const desktopVariant = ZONE_VARIANT[zone];
  const variant: Variant | "mobile" | null = hidden ? null : desktopVariant && mobile ? "mobile" : desktopVariant;

  return (
    <AnimatePresence mode="wait">
      {variant === "mobile" && (
        <motion.div
          key="mobile"
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="glass-dark fixed inset-x-3 bottom-3 z-40 flex items-center justify-between gap-3 rounded-2xl px-3.5 py-2.5"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[17px] font-extrabold">{INR(pricing.offerPrice)}</span>
              <OffBadge pricing={pricing} />
            </div>
            <p className="mt-0.5 font-mono text-[11px] tabular-nums text-[#ff8fa3]">
              Ends in {clock.d} {clock.hms}
            </p>
          </div>
          <button onClick={onEnroll} className="btn-primary shrink-0 px-4 py-2.5 text-[13px]">
            Join now
          </button>
        </motion.div>
      )}

      {(variant === "pill" || variant === "pill-danger") && (
        <motion.button
          key="pill"
          {...enter[variant]}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          onClick={onEnroll}
          className={`fixed left-1/2 top-4 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full px-2 py-1.5 pr-3 text-[13px] backdrop-blur-xl transition-colors ${
            variant === "pill-danger"
              ? "border border-[#ff4d6d]/40 bg-[#2a0610]/80 shadow-[0_10px_40px_-10px_rgba(255,46,99,.6)]"
              : "glass-dark"
          }`}
        >
          <OffBadge pricing={pricing} className="rounded-full px-2.5 py-1" />
          <span className="font-extrabold">{INR(pricing.offerPrice)}</span>
          <span className="h-4 w-px bg-white/15" />
          <span className="flex items-center gap-1.5 font-mono tabular-nums text-foreground/85">
            <Timer size={13} className="text-[#ff8fa3]" />
            {clock.d} {clock.hms}
          </span>
          <span className="flex items-center gap-1 font-semibold text-[#a5b4ff]">
            Join <ArrowRight size={13} />
          </span>
        </motion.button>
      )}

      {variant === "bar" && (
        <motion.div
          key="bar"
          {...enter.bar}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="glass-dark fixed bottom-5 left-1/2 z-40 flex w-[min(600px,calc(100%-32px))] -translate-x-1/2 items-center justify-between gap-4 rounded-2xl px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold">{INR(pricing.offerPrice)}</span>
                <span className="text-sm text-muted line-through">{INR(pricing.listPrice)}</span>
                <OffBadge pricing={pricing} />
              </div>
              <p className="mt-0.5 font-mono text-[11.5px] tabular-nums text-[#ff8fa3]">
                Incl. GST · ends in {clock.d} {clock.hms}
              </p>
            </div>
          </div>
          <button onClick={onEnroll} className="btn-primary shrink-0 px-5 py-3 text-sm">
            Join AI Corporate Analyst
          </button>
        </motion.div>
      )}

      {variant === "glass" && (
        <motion.button
          key="glass"
          {...enter.glass}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          onClick={onEnroll}
          className="fixed right-6 top-1/2 z-40 w-[210px] -translate-y-1/2 rounded-2xl border border-white/50 bg-white/55 p-4 text-left text-[#0b1024] shadow-[0_20px_60px_-20px_rgba(60,60,140,.45)] backdrop-blur-xl"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5b5fa8]">Launch offer</p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-2xl font-extrabold">{INR(pricing.offerPrice)}</span>
            <OffBadge pricing={pricing} />
          </div>
          <p className="mt-1 font-mono text-[12px] tabular-nums text-[#c81e4b]">
            {clock.d} {clock.hms} left
          </p>
          <span className="mt-3 flex items-center gap-1 text-[13px] font-semibold text-[#3b4bdc]">
            Reserve your seat <ArrowRight size={13} />
          </span>
        </motion.button>
      )}

      {variant === "corner" && (
        <motion.button
          key="corner"
          {...enter.corner}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          onClick={onEnroll}
          className="glass-dark fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full py-2 pl-2 pr-4 text-[13px]"
        >
          <OffBadge pricing={pricing} className="rounded-full px-2.5 py-1" />
          <span className="font-extrabold">{INR(pricing.offerPrice)}</span>
          <span className="font-mono text-[12px] tabular-nums text-muted">{clock.hms}</span>
        </motion.button>
      )}

      {variant === "side" && (
        <motion.button
          key="side"
          {...enter.side}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          onClick={onEnroll}
          className="glass-dark fixed right-4 top-[70%] z-40 flex w-[96px] -translate-y-1/2 flex-col items-center gap-2 rounded-2xl px-2 py-3.5 text-center"
        >
          <OffBadge pricing={pricing} />
          <span className="text-[17px] font-extrabold leading-none">{INR(pricing.offerPrice)}</span>
          <span className="font-mono text-[10.5px] leading-tight tabular-nums text-[#ff8fa3]">
            {clock.d}
            <br />
            {clock.hms}
          </span>
          <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#3b6bff] to-[#7c5cff]">
            <ArrowRight size={14} />
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
