"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Flame } from "lucide-react";
import { useCountdown } from "@/lib/useCountdown";
import { cohort } from "@/content/shared";
import { CTA } from "@/content/course";
import { useStudio } from "./StudioContext";
import type { AudienceContent } from "@/content/types";

const pad = (n: number) => String(n).padStart(2, "0");
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
});

/** Name tag on the hero photo; the second line cycles through Prasun's headline credentials. */
function NameTag({ name }: { name: string }) {
  const lines = useStudio().copy.founderHighlights;
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % lines.length), 2600);
    return () => clearInterval(id);
  }, [reduce, lines.length]);

  return (
    <div className="absolute bottom-[5%] right-0 w-[min(100%,17.5rem)] rounded-2xl border border-[#e3e6eb] bg-white/95 px-4 py-2.5 shadow-[0_16px_34px_-18px_rgba(28,29,31,.45)] backdrop-blur">
      <p className="text-[14.5px] font-bold leading-tight">{name}</p>
      {/* All lines stay mounted; CSS transitions slide the active one in, so a skipped frame can never leave it blank. */}
      <div className="relative mt-0.5 h-[20px] overflow-hidden" aria-hidden>
        {lines.map((line, k) => (
          <p
            key={line}
            className={`absolute inset-x-0 top-0 flex items-center gap-1.5 whitespace-nowrap text-[12.5px] font-semibold text-accent transition-[transform,opacity] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
              k === i ? "translate-y-0 opacity-100" : k === (i - 1 + lines.length) % lines.length ? "-translate-y-full opacity-0" : "translate-y-full opacity-0"
            }`}
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#6fd8b9]" />
            {line}
          </p>
        ))}
      </div>
      <span className="sr-only">{lines.join(", ")}</span>
    </div>
  );
}

/** Price as a tear-off ticket: perforated stub for the discount, a sheen that sweeps across. */
function PriceTicket({ offer, list, off }: { offer: number; list: number; off: number }) {
  return (
    <motion.span
      whileHover={{ y: -3, rotate: -0.6 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className="relative flex h-[52px] items-stretch overflow-hidden rounded-xl border border-[#e3e6eb] bg-white shadow-[0_10px_24px_-16px_rgba(28,29,31,.5)]"
    >
      <span className="flex items-baseline gap-2 self-center pl-4 pr-3">
        <span className="font-[family-name:var(--font-serif)] text-[24px] font-bold leading-none">{inr(offer)}</span>
        <span className="text-[13px] text-muted line-through decoration-[#c0392b]/60">{inr(list)}</span>
      </span>
      <span className="relative flex flex-col items-center justify-center border-l-2 border-dashed border-[#cfe9df] bg-[#effaf6] px-3 text-center font-bold leading-none text-success">
        {/* notches punched out of the ticket edge, in the page white */}
        <span aria-hidden className="absolute -left-[7px] -top-[6px] h-3 w-3 rounded-full border border-[#e3e6eb] bg-white" />
        <span aria-hidden className="absolute -bottom-[6px] -left-[7px] h-3 w-3 rounded-full border border-[#e3e6eb] bg-white" />
        <span className="text-[15px]">{off}%</span>
        <span className="mt-0.5 text-[9.5px] tracking-[0.14em]">OFF</span>
      </span>
      <span aria-hidden className="sheen" />
    </motion.span>
  );
}

/** Flip-style tiles; the seconds tile drops in on every tick, and the clock hand sweeps. */
function CountdownTiles({ left }: { left: ReturnType<typeof useCountdown> }) {
  const units = left
    ? [
        { v: left.days, u: "days" },
        { v: left.hours, u: "hrs" },
        { v: left.minutes, u: "min" },
        { v: left.seconds, u: "sec" },
      ]
    : [];
  return (
    <motion.span
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className="flex h-[52px] items-center gap-2.5 rounded-xl border border-[#e3e6eb] bg-white pl-3 pr-3.5 shadow-[0_10px_24px_-16px_rgba(28,29,31,.5)]"
      aria-label="Offer ends in"
    >
      <svg viewBox="0 0 20 20" className="h-[18px] w-[18px] shrink-0 text-accent" aria-hidden>
        <circle cx="10" cy="10" r="8.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <circle cx="10" cy="10" r="8.2" fill="none" />
          <line x1="10" y1="10" x2="10" y2="4.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </motion.g>
        <circle cx="10" cy="10" r="1.3" fill="currentColor" />
      </svg>
      {left ? (
        <span className="flex items-start gap-1">
          {units.map((x, i) => (
            <span key={x.u} className="flex items-start gap-1">
              <span className="flex flex-col items-center">
                <span className="relative flex h-[24px] min-w-[26px] items-center justify-center overflow-hidden rounded-[6px] bg-[#1c1d1f] px-1 font-mono text-[13px] font-bold tabular-nums text-white shadow-[inset_0_-1px_0_rgba(255,255,255,.08)]">
                  {x.u === "sec" ? (
                    <motion.span key={x.v} initial={{ y: -10, opacity: 0.2 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.28, ease: "easeOut" }}>
                      {pad(x.v)}
                    </motion.span>
                  ) : (
                    pad(x.v)
                  )}
                  <span aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-black/40" />
                </span>
                <span className="mt-[1px] text-[8.5px] font-semibold uppercase tracking-wider text-muted">{x.u}</span>
              </span>
              {i < units.length - 1 && <span className="pt-[3px] font-mono text-[13px] font-bold text-muted">:</span>}
            </span>
          ))}
        </span>
      ) : (
        <span className="font-mono text-[13px] text-muted">--</span>
      )}
    </motion.span>
  );
}

/** The one CTA: purple shimmer, a soft pulsing ring, and an arrow that keeps nudging forward. */
function EnrollCta({ onClick }: { onClick: () => void }) {
  return (
    <span className="relative flex w-full sm:inline-flex sm:w-auto">
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-1 rounded-[12px] border-2 border-[#7c4dff]"
        animate={{ scale: [1, 1.07], opacity: [0.55, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.button
        onClick={onClick}
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="btn-primary hero-cta group relative h-[52px] w-full overflow-hidden px-6 text-[15px] sm:w-auto"
      >
        <span className="relative z-10">{CTA}</span>
        <motion.span
          className="relative z-10 flex"
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowRight size={17} />
        </motion.span>
        <span aria-hidden className="sheen sheen-strong" />
      </motion.button>
    </span>
  );
}

/** Tiny tear-off calendar page, e.g. OCT / 15. */
function CalendarPage({ label }: { label: string }) {
  const [day, month = ""] = label.split(" ");
  return (
    <span aria-hidden className="flex w-[30px] flex-col overflow-hidden rounded-[7px] border border-[#e3e6eb] bg-white text-center leading-none shadow-[0_2px_6px_-3px_rgba(28,29,31,.4)]">
      <span className="bg-accent py-[2px] text-[7.5px] font-bold uppercase tracking-wider text-white">{month}</span>
      <span className="py-[3px] text-[13px] font-bold text-foreground">{day}</span>
    </span>
  );
}

export default function HeroStudio({ content, onEnroll }: { content: AudienceContent; onEnroll: () => void }) {
  const { pricing, faculty } = content;
  const { founder } = faculty;
  const { hero } = useStudio().copy;
  const off = Math.round((1 - pricing.offerPrice / pricing.listPrice) * 100);
  const left = useCountdown(pricing.offerEndsAt);

  return (
    <>
      {/* Sticky, single-CTA bar. No menu and no outbound links (CRO brief: no exits). */}
      <nav className="sticky top-0 z-40 border-b border-border bg-white/90 px-5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 py-3">
          <Image src="/logos/azisly-brand.png" alt="Azisly.ai" width={692} height={233} sizes="120px" className="h-[30px] w-auto sm:h-[36px]" priority />
          <div className="flex items-center gap-3">
            <span className="hidden text-right text-[12.5px] leading-tight text-muted sm:block">
              <b className="text-[15px] text-foreground">{inr(pricing.offerPrice)}</b> incl. GST
              <br />
              Classes start {cohort.startsLabel}
            </span>
            <button onClick={onEnroll} className="btn-primary px-4 py-2.5 text-[14px]">
              {CTA}
            </button>
          </div>
        </div>
      </nav>

      <section className="overflow-hidden bg-white px-4 sm:px-5">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-12 py-5 sm:py-12 lg:grid-cols-[1.3fr_.7fr] lg:gap-12 lg:py-16">
          <div className="px-1 sm:px-0">
            <motion.p {...rise(0)} className="text-[12px] font-semibold uppercase tracking-[0.2em] text-accent sm:text-[13px]">
              {hero.eyebrow}
            </motion.p>
            <motion.h1 {...rise(0.05)} className="display mt-2 text-[clamp(36px,5.4vw,68px)] leading-[1.02] sm:mt-3">
              {hero.title}
            </motion.h1>
            <motion.p {...rise(0.08)} className="mt-2 font-[family-name:var(--font-serif)] text-[19px] font-semibold text-[#2d2f31] sm:mt-3 sm:text-[22px]">
              {hero.tagline}
            </motion.p>

            {/* Trust marker on the first mobile screen; desktop shows the full photo alongside. */}
            <motion.div {...rise(0.09)} className="mt-4 flex items-center gap-3 lg:hidden">
              <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[#e6dcff] ring-2 ring-[#ff4fd8]">
                <Image src="/faculty/prasun-cutout.webp" alt="" fill sizes="88px" className="origin-top scale-[1.9] object-cover object-top" />
              </span>
              <p className="text-[13px] leading-snug">
                <b>Taught live by {founder.name}</b>
                <br />
                <span className="text-muted">IIT Kharagpur · Ex-President, OYO International</span>
              </p>
            </motion.div>

            <motion.p {...rise(0.1)} className="mt-4 max-w-[520px] text-[15.5px] leading-relaxed text-[#2d2f31] sm:mt-5 sm:text-[18px]">
              {hero.body}
            </motion.p>

            <motion.div {...rise(0.15)} className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
              <PriceTicket offer={pricing.offerPrice} list={pricing.listPrice} off={off} />
              <CountdownTiles left={left} />
              <EnrollCta onClick={onEnroll} />
            </motion.div>
            <motion.div {...rise(0.2)} className="mt-3.5 flex flex-wrap items-center gap-2">
              <motion.span
                whileHover={{ y: -2 }}
                className="flex items-center gap-2 rounded-full border border-[#ffd0ee] bg-[#fff0f9] py-1.5 pl-2 pr-3 text-[13px] font-semibold text-[#b0127a]"
              >
                <motion.span
                  animate={{ scale: [1, 1.18, 0.94, 1.12, 1], rotate: [0, -6, 4, -3, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-b from-[#ffb36b] to-[#ff4f8b] text-white"
                >
                  <Flame size={13} fill="currentColor" />
                </motion.span>
                Hurry, only {pricing.seatsLeft} seats left
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff4f8b] opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e11d74]" />
                </span>
              </motion.span>
              <motion.span
                whileHover={{ y: -2 }}
                className="flex items-center gap-2 rounded-full border border-[#e3e6eb] bg-white py-1 pl-1 pr-3 text-[13px] font-semibold text-foreground"
              >
                <CalendarPage label={cohort.startsLabel} />
                Classes start {cohort.startsLabel}
              </motion.span>
            </motion.div>
            <motion.p {...rise(0.22)} className="mt-2.5 text-[12.5px] text-muted">
              Incl. GST · Secure checkout via Cashfree
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-[380px]"
          >
            <div className="relative aspect-[4/5]">
              {/* Two squares tucked behind Prasun: purple behind his head (top right), pink behind his arms (bottom left). */}
              <motion.span
                aria-hidden
                animate={{ y: [0, -8, 0], rotate: [6, 8, 6] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute right-[2%] top-[5%] aspect-square w-[50%] rounded-[22px] bg-[linear-gradient(145deg,#7c4dff,#5624d0)] shadow-[0_24px_50px_-24px_rgba(86,36,208,.7)]"
              />
              <motion.span
                aria-hidden
                animate={{ y: [0, 8, 0], rotate: [-8, -6, -8] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                className="absolute bottom-[10%] left-[-4%] aspect-square w-[44%] rounded-[22px] bg-[linear-gradient(145deg,#ff7be3,#ff4fd8)] shadow-[0_24px_50px_-24px_rgba(255,79,216,.7)]"
              />

              <Image
                src="/faculty/prasun-cutout.webp"
                alt={founder.name}
                fill
                priority
                sizes="(min-width: 1024px) 380px, 90vw"
                className="object-contain object-bottom drop-shadow-[0_20px_28px_rgba(28,29,31,.25)] [mask-image:linear-gradient(to_bottom,#000_88%,transparent_100%)]"
              />

              <NameTag name={founder.name} />

            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
