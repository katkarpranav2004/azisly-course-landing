"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import FlipClock from "@/components/clocks/FlipClock";
import AnalystComposition from "./AnalystComposition";
import MagneticButton from "./MagneticButton";
import OfferPrice from "./OfferPrice";
import { hero } from "@/content/corporate-launch";
import type { PricingConfig } from "@/content/types";

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function HeroLaunch({
  pricing,
  onEnroll,
}: {
  pricing: PricingConfig;
  onEnroll: () => void;
}) {
  return (
    <section
      data-offer-zone="hero"
      className="relative overflow-hidden bg-[radial-gradient(ellipse_90%_70%_at_75%_10%,#13205a_0%,#0a0f2e_40%,#050816_75%)] px-5 pb-14 sm:pb-20"
    >
      <div aria-hidden className="holo-grid absolute inset-0 opacity-70" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between py-3.5">
        <span className="text-lg font-extrabold tracking-tight">
          Azisly<span className="text-[#7c8cff]">.</span>
        </span>
        <span className="badge">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ff2e63] shadow-[0_0_10px_#ff2e63] [animation:soft-pulse_1.2s_infinite]" />
          Launch offer live · {pricing.seatsLeft} seats left
        </span>
      </header>

      <div className="relative z-10 mx-auto mt-4 grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-10 lg:mt-2 lg:grid-cols-[1.02fr_.98fr] lg:gap-6">
        <div>
          <motion.p {...rise(0)} className="eyebrow text-[#a5b4ff]">
            {hero.eyebrow}
          </motion.p>
          <motion.h1
            {...rise(0.05)}
            className="display mt-3 text-[clamp(38px,5vw,66px)] leading-[0.95]"
          >
            {hero.headline} <span className="accent-text">{hero.headlineAccent}</span>
          </motion.h1>
          <motion.p {...rise(0.1)} className="mt-4 max-w-[520px] text-[15.5px] leading-relaxed text-[#b4bcda] sm:text-[16.5px]">
            {hero.sub}
          </motion.p>

          <motion.div {...rise(0.15)} className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[11px] uppercase tracking-[0.2em] text-muted">Built for</span>
            {hero.forWho.map((w) => (
              <span key={w} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[12px] text-foreground/80">
                {w}
              </span>
            ))}
          </motion.div>

          <motion.div
            {...rise(0.2)}
            className="glass-dark relative mt-5 overflow-hidden rounded-3xl p-5"
          >
            <div aria-hidden className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#7c5cff]/25 blur-3xl" />
            <OfferPrice pricing={pricing} size="lg" delay={0.5} />
            <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ff8fa3]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ff2e63] [animation:soft-pulse_1s_infinite]" />
                  Offer expires in
                </p>
                <FlipClock endsAt={pricing.offerEndsAt} size="sm" />
              </div>
              <div className="flex flex-col items-stretch gap-2 sm:items-end">
                <MagneticButton onClick={onEnroll} className="px-6 py-4 text-[15px]">
                  Join for ₹{pricing.offerPrice.toLocaleString("en-IN")} <ArrowRight size={17} />
                </MagneticButton>
                <span className="flex items-center justify-center gap-1.5 text-[11px] text-muted">
                  <ShieldCheck size={12} /> Secure checkout · Cashfree
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <AnalystComposition />
        </motion.div>
      </div>
    </section>
  );
}
