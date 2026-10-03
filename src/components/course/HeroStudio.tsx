"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Award, BarChart3, Bot, Briefcase, FileSpreadsheet, FileText, Flame, Package, ShieldCheck, TrendingUp, Users, Video } from "lucide-react";
import { useCountdown } from "@/lib/useCountdown";
import { cohort, reach, trustedBy } from "@/content/shared";
import { CTA } from "@/content/course";
import { useStudio } from "./StudioContext";
import IntroVideo from "./IntroVideo";
import type { AudienceContent } from "@/content/types";

const pad = (n: number) => String(n).padStart(2, "0");
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
});

/**
 * Caption above the photo: Prasun's name, with a line that cycles through his headline credentials,
 * and a hand-drawn arrow pointing at him.
 */
function PhotoCaption({ name }: { name: string }) {
  const lines = useStudio().copy.founderHighlights;
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % lines.length), 2600);
    return () => clearInterval(id);
  }, [reduce, lines.length]);

  return (
    <div className="absolute -top-[17%] right-0 z-10 hidden w-[min(100%,15.5rem)] text-left lg:block">
      <p className="text-[14.5px] font-bold leading-tight">{name}</p>
      {/* All lines stay mounted; CSS transitions slide the active one in, so a skipped frame can never leave it blank. */}
      <div className="relative mt-0.5 h-[34px] overflow-hidden text-[12.5px] leading-snug text-muted" aria-hidden>
        {lines.map((line, k) => (
          <p
            key={line}
            className={`absolute inset-x-0 top-0 transition-[transform,opacity] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
              k === i ? "translate-y-0 opacity-100" : k === (i - 1 + lines.length) % lines.length ? "-translate-y-full opacity-0" : "translate-y-full opacity-0"
            }`}
          >
            {line}
          </p>
        ))}
      </div>
      <span className="sr-only">{lines.join(", ")}</span>
      <svg aria-hidden viewBox="0 0 70 56" className="pointer-events-none absolute -bottom-[34px] left-3 h-[50px] w-[64px] overflow-visible">
        <g fill="none" stroke="#5624d0" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <motion.path d="M62 4 C 48 6, 20 14, 14 46" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.9, ease: "easeInOut" }} />
          <motion.path d="M4 37 L 14 49 L 25 39" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.25, delay: 1.45 }} />
        </g>
      </svg>
    </div>
  );
}

/** "Trusted by professionals from ..." card over the bottom of the photo (corporate only). */
function TrustedCard() {
  return (
    <div className="rounded-[18px] border border-[#e6e4f0] bg-white px-4 pb-3.5 pt-3 shadow-[0_18px_40px_-20px_rgba(60,40,160,.5)]">
      <p className="text-[13px] font-medium text-[#33363b]">{trustedBy.heading}</p>
      <Image src={trustedBy.logos} alt={trustedBy.alt} width={480} height={44} unoptimized className="mt-2.5 h-auto w-full max-w-[300px]" />
    </div>
  );
}

const pillClock = (
  <svg viewBox="0 0 20 20" className="h-[22px] w-[22px] shrink-0 text-accent" aria-hidden>
    <circle cx="10" cy="10" r="8.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
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
);

/** Left block of the offer card: red discount tag, big price with the old price struck through, GST note. */
function PriceBlock({ offer, list, off }: { offer: number; list: number; off: number }) {
  return (
    <div className="shrink-0">
      <span className="inline-block rounded-lg bg-gradient-to-r from-[#ff3b4f] to-[#ff2e7e] px-2.5 py-1 text-[12.5px] font-extrabold tracking-wide text-white shadow-[0_8px_16px_-8px_rgba(255,46,100,.7)]">
        {off}% OFF
      </span>
      <div className="mt-1.5 flex items-baseline gap-2.5">
        <span className="font-[family-name:var(--font-serif)] text-[34px] font-bold leading-none tracking-tight sm:text-[38px]">{inr(offer)}</span>
        <span className="text-[15px] text-muted line-through decoration-[#c0392b]/60">{inr(list)}</span>
      </div>
      <p className="mt-1 text-[12.5px] text-muted">Incl. GST</p>
    </div>
  );
}

/** Countdown: four dark tiles with their unit labels underneath; the seconds tile drops in on every tick. */
function TimerTiles({ left }: { left: ReturnType<typeof useCountdown> }) {
  const units = left
    ? [
        { v: left.days, u: "Days" },
        { v: left.hours, u: "Hours" },
        { v: left.minutes, u: "Mins" },
        { v: left.seconds, u: "Secs" },
      ]
    : [];
  return (
    <div className="shrink-0" role="timer" aria-label="Offer ends in">
      <p className="mb-2 flex items-center gap-2 text-[14px] font-medium text-[#33363b]">
        {pillClock} Offer ends in
      </p>
      {left ? (
        <div className="flex items-start gap-1.5">
          {units.map((x, i) => (
            <div key={x.u} className="flex items-start gap-1.5">
              <div className="flex flex-col items-center">
                <span className="relative flex h-[42px] w-[44px] items-center justify-center overflow-hidden rounded-[10px] bg-[#16171a] font-mono text-[19px] font-bold tabular-nums text-white shadow-[inset_0_-1px_0_rgba(255,255,255,.08),0_8px_16px_-10px_rgba(0,0,0,.6)]">
                  {x.u === "Secs" ? (
                    <motion.span key={x.v} initial={{ y: -12, opacity: 0.2 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.28, ease: "easeOut" }}>
                      {pad(x.v)}
                    </motion.span>
                  ) : (
                    pad(x.v)
                  )}
                </span>
                <span className="mt-1.5 text-[10.5px] font-medium uppercase tracking-wide text-muted">{x.u}</span>
              </div>
              {i < units.length - 1 && <span className="pt-2 font-mono text-[18px] font-bold text-[#8a8d96]">:</span>}
            </div>
          ))}
        </div>
      ) : (
        <span className="font-mono text-[13px] text-muted">--</span>
      )}
    </div>
  );
}
/** The one CTA: purple shimmer, a soft pulsing ring, and an arrow that keeps nudging forward. */
function EnrollCta({ onClick, full = false }: { onClick: () => void; full?: boolean }) {
  return (
    <span className={`relative flex w-full ${full ? "" : "sm:inline-flex sm:w-auto"}`}>
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
        className={`btn-primary hero-cta group relative h-[52px] w-full overflow-hidden px-6 text-[15px] ${full ? "" : "sm:w-auto"}`}
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

const FEATURE_ICONS = {
  work: { Icon: FileText, tint: "bg-[#f1ecff] text-[#5624d0]" },
  templates: { Icon: TrendingUp, tint: "bg-[#e6f7f0] text-[#13805c]" },
  build: { Icon: Package, tint: "bg-[#fff3dc] text-[#b86e00]" },
  certificate: { Icon: Award, tint: "bg-[#e8f1ff] text-[#2563c9]" },
} as const;

const TAG_ICONS = {
  excel: { Icon: FileSpreadsheet, tint: "bg-[#e3f5ea] text-[#1d7a45]" },
  reports: { Icon: FileText, tint: "bg-[#f1ecff] text-[#5624d0]" },
  agents: { Icon: Bot, tint: "bg-[#fff3dc] text-[#b86e00]" },
  dashboards: { Icon: BarChart3, tint: "bg-[#e8f1ff] text-[#2563c9]" },
} as const;

const PILL_ICONS = [Video, Users, Briefcase];

/** Hand-drawn underline that draws itself under the accented words of the headline. */
function Headline({ text, accent }: { text: string; accent?: string }) {
  const at = accent ? text.indexOf(accent) : -1;
  if (!accent || at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span className="relative inline-block whitespace-nowrap">
        {accent}
        <svg aria-hidden viewBox="0 0 300 18" preserveAspectRatio="none" className="pointer-events-none absolute -bottom-[0.12em] left-0 h-[0.2em] w-full overflow-visible">
          <motion.path
            d="M3 11 C 70 3, 150 16, 297 5"
            fill="none"
            stroke="#5624d0"
            strokeWidth="5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.55, ease: "easeOut" }}
          />
        </svg>
      </span>
      {text.slice(at + accent.length)}
    </>
  );
}

/** Four short selling points with coloured icon tiles, separated by hairlines on desktop. */
function FeatureRow({ items }: { items: NonNullable<ReturnType<typeof useStudio>["copy"]["hero"]["features"]> }) {
  return (
    <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3.5 sm:grid-cols-4 sm:gap-0 lg:mt-[clamp(12px,2.2vh,24px)] lg:max-w-[660px]">
      {items.map((f) => {
        const { Icon, tint } = FEATURE_ICONS[f.icon];
        return (
          <li key={f.title} className="flex items-center gap-2.5 sm:border-l sm:border-border sm:px-3 sm:first:border-l-0 sm:first:pl-0">
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tint}`}>
              <Icon size={19} strokeWidth={1.9} />
            </span>
            <span className="text-[13px] font-medium leading-snug">{f.title}</span>
          </li>
        );
      })}
    </ul>
  );
}

/** Floating topic cards that sit beside the photo (wide screens only; narrower ones have no room for them). */
function TagCards({ items }: { items: NonNullable<ReturnType<typeof useStudio>["copy"]["hero"]["tags"]> }) {
  const tilt = [-1.5, 1, -1, 1.5];
  return (
    <ul className="tag-cards absolute -left-[28%] top-[1%] z-10 hidden w-[162px] flex-col gap-1.5 xl:flex">
      {items.map((t, i) => {
        const { Icon, tint } = TAG_ICONS[t.icon];
        return (
          <motion.li
            key={t.title}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.45 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -3 }}
            style={{ rotate: tilt[i % tilt.length] }}
            className="flex items-center gap-2.5 rounded-2xl border border-[#ebe8f7] bg-white p-2 shadow-[0_14px_30px_-16px_rgba(60,40,160,.5)]"
          >
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${tint}`}>
              <Icon size={17} strokeWidth={1.9} />
            </span>
            <span className="text-[12.5px] font-semibold leading-tight">{t.title}</span>
          </motion.li>
        );
      })}
    </ul>
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
          <Image src="/logos/azisly-brand.svg" alt="Azisly.ai" width={2788} height={937} unoptimized className="h-[30px] w-auto sm:h-[36px]" priority />
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

      <section className="relative overflow-hidden bg-white px-4 sm:px-5">
        {/* soft lavender glow behind the photo */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_70%_at_82%_38%,rgba(124,77,255,.11),transparent_70%)]" />

        {hero.pills && (
          <ul className="relative mx-auto hidden max-w-6xl justify-end gap-2 pt-5 md:flex lg:pt-[clamp(8px,1.5vh,20px)]">
            {hero.pills.map((p, i) => {
              const Icon = PILL_ICONS[i % PILL_ICONS.length];
              return (
                <li key={p} className="flex items-center gap-2 rounded-full border border-[#ebe8f7] bg-white/85 py-1.5 pl-2 pr-3.5 text-[13px] font-medium shadow-[0_8px_20px_-14px_rgba(60,40,160,.45)]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f1ecff] text-accent">
                    <Icon size={13} />
                  </span>
                  {p}
                </li>
              );
            })}
          </ul>
        )}

        <div className="relative mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-12 py-5 sm:py-10 lg:grid-cols-[1.3fr_.7fr] lg:gap-10 lg:pb-[clamp(22px,3.8vh,46px)] lg:pt-[clamp(8px,1.8vh,26px)]">
          <div className="px-1 sm:px-0">
            <motion.p {...rise(0)} className="text-[12px] font-semibold uppercase tracking-[0.2em] text-accent sm:text-[13px]">
              {hero.eyebrow}
            </motion.p>
            <motion.h1 {...rise(0.05)} className="display mt-2 text-[clamp(36px,min(5.4vw,6.9vh),68px)] leading-[1.04] sm:mt-3">
              <Headline text={hero.title} accent={hero.titleAccent} />
            </motion.h1>
            {hero.tagline && (
              <motion.p {...rise(0.08)} className="mt-2 font-[family-name:var(--font-serif)] text-[19px] font-semibold text-[#2d2f31] sm:mt-3 sm:text-[22px]">
                {hero.tagline}
              </motion.p>
            )}

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

            <motion.p {...rise(0.1)} className="mt-4 max-w-[560px] text-[15.5px] leading-relaxed text-[#2d2f31] sm:mt-5 sm:text-[18px] lg:mt-4 lg:max-w-[700px] lg:text-[17px] lg:leading-[1.5]">
              {hero.body}
            </motion.p>

            {hero.features && (
              <motion.div {...rise(0.12)}>
                <FeatureRow items={hero.features} />
              </motion.div>
            )}

            {/* Offer card: price, countdown and the CTA together, with the checkout line centred under the button. */}
            <motion.div
              {...rise(0.15)}
              className="mt-6 rounded-[22px] border border-[#e6e4f3] bg-[linear-gradient(180deg,#fbfaff,#f6f4fd)] p-4 shadow-[0_24px_50px_-34px_rgba(60,40,160,.45)] sm:mt-7 sm:p-5 lg:mt-[clamp(12px,2.2vh,24px)] lg:p-[clamp(12px,1.8vh,20px)]"
            >
              <div className="flex flex-wrap items-center gap-x-5 gap-y-5 md:flex-nowrap md:gap-x-5">
                <PriceBlock offer={pricing.offerPrice} list={pricing.listPrice} off={off} />
                <span aria-hidden className="hidden h-[76px] w-px shrink-0 bg-[#e3e0f0] md:block" />
                <TimerTiles left={left} />
                <div className="flex w-full flex-col items-stretch gap-2 md:w-auto md:min-w-[176px] md:flex-1">
                  <EnrollCta onClick={onEnroll} full />
                  <p className="flex items-center justify-center gap-1.5 text-[12px] text-muted">
                    <ShieldCheck size={13} className="text-success" /> Secure checkout via Cashfree
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div {...rise(0.2)} className="mt-4 flex flex-wrap items-center gap-2 lg:mt-[clamp(8px,1.5vh,16px)]">
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
              {content.audience !== "course" && (
                <motion.span
                  whileHover={{ y: -2 }}
                  className="flex items-center gap-2 rounded-full border border-[#e3e6eb] bg-white py-1.5 pl-2.5 pr-3 text-[13px] font-semibold text-foreground"
                >
                  <Users size={15} className="text-accent" />
                  {reach[content.audience]}
                </motion.span>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-[380px] lg:max-w-[min(380px,38vh)] lg:translate-y-[clamp(20px,5vh,52px)]"
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

              {hero.tags && <TagCards items={hero.tags} />}
              <PhotoCaption name={founder.name} />
              <div className="absolute -bottom-[3%] right-0 z-10 flex w-[min(100%,21rem)] flex-col gap-2.5 sm:-right-[6%]">
                {content.audience === "corporate" && <TrustedCard />}
                <IntroVideo onEnroll={onEnroll} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}