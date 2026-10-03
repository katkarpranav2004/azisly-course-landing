"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Award, Box, CalendarDays, Code, ShieldCheck, Users, Video, type LucideIcon } from "lucide-react";
import MagneticButton from "@/components/launch/MagneticButton";
import DuoComposition from "./DuoComposition";
import { hero } from "@/content/college-launch";
import { cohort, reach } from "@/content/shared";
import { useCountdown } from "@/lib/useCountdown";
import type { PricingConfig } from "@/content/types";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const pad = (n: number) => String(n).padStart(2, "0");

const STAT_ICONS: Record<(typeof hero.stats)[number]["icon"], LucideIcon> = { video: Video, box: Box, award: Award, code: Code };

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

/** Left block of the offer card: white discount tag, big price with the old price struck through, GST note. */
function PriceBlock({ pricing }: { pricing: PricingConfig }) {
  const off = Math.round((1 - pricing.offerPrice / pricing.listPrice) * 100);
  return (
    <div className="shrink-0">
      <motion.span
        className="inline-block rounded-lg bg-white px-2.5 py-1 font-[family-name:var(--font-unbounded)] text-[12px] font-extrabold tracking-tight text-[#c2185b] shadow-[0_8px_20px_-8px_rgba(255,255,255,.8)]"
        initial={{ scale: 0, rotate: -14 }}
        animate={{ scale: [0, 1.2, 1], rotate: -4 }}
        transition={{ delay: 0.9, duration: 0.5, ease: "backOut" }}
      >
        {off}% OFF
      </motion.span>
      <div className="mt-2 flex items-baseline gap-2.5">
        <motion.span
          className="display font-[family-name:var(--font-unbounded)] text-[clamp(34px,3.4vw,44px)] leading-none text-white [text-shadow:0_0_34px_rgba(255,255,255,.55)]"
          initial={{ opacity: 0, scale: 0.85, filter: "blur(8px)" }}
          animate={{ opacity: 1, scale: [0.85, 1.05, 1], filter: "blur(0px)" }}
          transition={{ delay: 0.5, duration: 0.8, times: [0, 0.6, 1], ease: [0.22, 1, 0.36, 1] }}
        >
          {inr(pricing.offerPrice)}
        </motion.span>
        <span className="text-[15px] text-white/75 line-through decoration-white/80">{inr(pricing.listPrice)}</span>
      </div>
      <p className="mt-1.5 text-[11.5px] font-medium uppercase tracking-[0.14em] text-white/80">Incl. GST</p>
    </div>
  );
}

/** Countdown as four frosted tiles with their unit labels underneath; the seconds tile drops in on every tick. */
function TimerTiles({ endsAt }: { endsAt: string }) {
  const left = useCountdown(endsAt);
  const units = [
    { v: left?.days ?? 0, u: "Days" },
    { v: left?.hours ?? 0, u: "Hours" },
    { v: left?.minutes ?? 0, u: "Mins" },
    { v: left?.seconds ?? 0, u: "Secs" },
  ];
  return (
    <div className="shrink-0" role="timer" aria-label="Offer ends in">
      <p className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-white/90">
        <span className="h-1.5 w-1.5 rounded-full bg-white [animation:soft-pulse_1s_infinite]" />
        Offer ends in
      </p>
      <div className={`flex items-start gap-1.5 transition-opacity duration-500 ${left ? "opacity-100" : "opacity-0"}`}>
        {units.map((x, i) => (
          <div key={x.u} className="flex items-start gap-1.5">
            <div className="flex flex-col items-center">
              <span className="relative flex h-[44px] w-[46px] items-center justify-center overflow-hidden rounded-[11px] border border-white/40 bg-white/20 font-mono text-[20px] font-bold tabular-nums text-white shadow-[inset_0_1px_0_rgba(255,255,255,.5)] backdrop-blur-md">
                {x.u === "Secs" ? (
                  <motion.span key={x.v} initial={{ y: -12, opacity: 0.2 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.28, ease: "easeOut" }}>
                    {pad(x.v)}
                  </motion.span>
                ) : (
                  pad(x.v)
                )}
              </span>
              <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-wide text-white/80">{x.u}</span>
            </div>
            {i < units.length - 1 && <span className="pt-2 font-mono text-[18px] font-bold text-white/70">:</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HeroCollege({ pricing, onEnroll }: { pricing: PricingConfig; onEnroll: () => void }) {
  return (
    <section data-offer-zone="hero" className="relative overflow-hidden px-5 pb-14 sm:pb-16">
      <div aria-hidden className="absolute -right-[20vmax] -top-[30vmax] h-[70vmax] w-[70vmax] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.35),transparent_60%)] blur-2xl" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between py-4">
        {/* White logo on a transparent background, made for the coloured hero. */}
        <Image
          src="/logos/azisly-white.svg"
          alt="Azisly.ai"
          width={2788}
          height={937}
          unoptimized
          priority
          className="h-[34px] w-auto drop-shadow-[0_4px_14px_rgba(60,0,60,.35)] sm:h-[40px]"
        />
      </header>

      <div className="relative z-10 mx-auto mt-4 grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-8 lg:mt-6 lg:grid-cols-[1.05fr_.95fr] lg:items-start lg:gap-6">
        <div>
          <motion.p {...rise(0)} className="eyebrow text-white/90">
            {hero.eyebrow}
          </motion.p>
          <motion.h1
            {...rise(0.05)}
            className="display mt-3 text-[clamp(32px,4.1vw,56px)] leading-[1.05] [text-shadow:0_10px_40px_rgba(80,0,60,.25)]"
          >
            {hero.headline} <span className="accent-text">{hero.headlineAccent}</span>
          </motion.h1>

          {/* the four numbers: frosted round icons, no boxes */}
          <motion.ul {...rise(0.1)} className="mt-6 grid max-w-[600px] grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4">
            {hero.stats.map((st) => {
              const Icon = STAT_ICONS[st.icon];
              return (
                <li key={st.label} className="flex items-center gap-2.5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/45 bg-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,.5)] backdrop-blur-md">
                    <Icon size={19} strokeWidth={1.8} />
                  </span>
                  <span className="min-w-0 leading-tight">
                    <b className="block font-[family-name:var(--font-unbounded)] text-[20px]">{st.value}</b>
                    <span className="block text-[11.5px] text-white/85">{st.label}</span>
                  </span>
                </li>
              );
            })}
          </motion.ul>

          {/* Offer card: price, countdown and the button together, with the checkout line centred under the button. */}
          <motion.div {...rise(0.16)} className="card relative mt-6 max-w-[600px] rounded-[26px] p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-5">
              <PriceBlock pricing={pricing} />
              <span aria-hidden className="hidden h-[76px] w-px shrink-0 bg-white/35 sm:block" />
              <TimerTiles endsAt={pricing.offerEndsAt} />
            </div>
            <div className="mt-5 flex flex-col items-stretch gap-2">
              <MagneticButton onClick={onEnroll} className="w-full">
                Grab my seat <ArrowRight size={16} />
              </MagneticButton>
              <span className="flex items-center justify-center gap-1.5 text-[11.5px] text-white/80">
                <ShieldCheck size={12} /> Secure checkout · Cashfree
              </span>
            </div>
          </motion.div>

          <motion.div {...rise(0.22)} className="mt-4 flex flex-wrap items-center gap-2">
            <span className="badge px-3 py-1.5 text-[12.5px]">
              <span className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_#fff] [animation:soft-pulse_1.2s_infinite]" />
              Student launch offer · {pricing.seatsLeft} seats left
            </span>
            <span className="badge px-3 py-1.5 text-[12.5px]">
              <CalendarDays size={14} /> Classes start {cohort.startsLabel}
            </span>
            <span className="badge px-3 py-1.5 text-[12.5px]">
              <Users size={14} /> {reach.college}
            </span>
          </motion.div>
        </div>

        <motion.div
          className="lg:pt-6"
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <DuoComposition />
        </motion.div>
      </div>
    </section>
  );
}
