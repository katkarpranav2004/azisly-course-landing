"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BarChart3, Bot, Briefcase, FileSpreadsheet, FileText, Flame, Globe2, GraduationCap, ShieldCheck, Users, Video } from "lucide-react";
import { useCountdown } from "@/lib/useCountdown";
import { cohort } from "@/content/shared";
import { CTA } from "@/content/course";
import { heroCombined as copy } from "@/content/hero-combined";
import { CalendarPage, EnrollCta } from "./HeroStudio";
import type { AudienceContent } from "@/content/types";

const pad = (n: number) => String(n).padStart(2, "0");
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const FEATURE = {
  excel: { Icon: FileSpreadsheet, tint: "bg-[#e3f5ea] text-[#1d7a45]" },
  reports: { Icon: FileText, tint: "bg-[#f1ecff] text-[#5624d0]" },
  agents: { Icon: Bot, tint: "bg-[#fff3dc] text-[#b86e00]" },
  dashboards: { Icon: BarChart3, tint: "bg-[#e8f1ff] text-[#2563c9]" },
} as const;

const CRED = { school: GraduationCap, work: Briefcase, globe: Globe2, years: Users } as const;

/**
 * Hero of the combined page: a calmer layout than the audience pages. Headline and one offer card on the left,
 * Prasun with a short credentials card on the right, and one quiet strip of facts underneath.
 */
export default function HeroCombined({ content, onEnroll }: { content: AudienceContent; onEnroll: () => void }) {
  const { pricing, faculty } = content;
  const off = Math.round((1 - pricing.offerPrice / pricing.listPrice) * 100);
  const left = useCountdown(pricing.offerEndsAt);
  const endsIn = left ? `${left.days}d ${pad(left.hours)}h ${pad(left.minutes)}m` : "";

  return (
    <>
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
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_75%_at_80%_40%,rgba(124,77,255,.12),transparent_70%)]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-3 pt-5 lg:pt-[clamp(12px,2.4vh,28px)]">
            <div className="flex items-center gap-3">
              <span className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-accent px-3.5 py-1.5 text-[13px] font-semibold text-white">
                <Video size={14} /> {copy.livePill}
              </span>
              <span aria-hidden className="hidden h-4 w-px bg-border sm:block" />
              <span className="text-[11.5px] font-semibold uppercase tracking-[0.2em] text-muted sm:text-[12.5px]">{copy.eyebrow}</span>
            </div>
            <ul className="hidden gap-2 lg:flex">
              {copy.topPills.map((p) => (
                <li key={p} className="rounded-full border border-[#ebe8f7] bg-white/85 px-3.5 py-1.5 text-[12.5px] font-medium shadow-[0_8px_20px_-14px_rgba(60,40,160,.45)]">
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-8 py-6 lg:grid-cols-[1.12fr_.88fr] lg:gap-6 lg:pb-[clamp(10px,2.4vh,26px)] lg:pt-[clamp(8px,1.6vh,20px)]">
            <div className="px-1 sm:px-0">
              <motion.h1 {...rise(0.05)} className="display text-[clamp(44px,min(6.2vw,8.2vh),88px)] leading-[1.02]">
                {copy.lineOne}
                <br />
                <span className="relative inline-block whitespace-nowrap text-accent">
                  {copy.lineTwo}
                  <svg aria-hidden viewBox="0 0 300 18" preserveAspectRatio="none" className="pointer-events-none absolute -bottom-[0.1em] left-0 h-[0.16em] w-full overflow-visible">
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
              </motion.h1>

              <motion.p {...rise(0.12)} className="mt-5 max-w-[600px] text-[16.5px] leading-relaxed text-[#33363b] lg:mt-[clamp(10px,2.2vh,22px)] lg:text-[clamp(15px,2.1vh,18px)]">
                {copy.body} <b className="text-foreground">{copy.bodyStrong}</b>
              </motion.p>

              <motion.ul {...rise(0.18)} className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4 sm:gap-0 lg:mt-[clamp(12px,2.4vh,26px)] lg:max-w-[640px]">
                {copy.features.map((f) => {
                  const { Icon, tint } = FEATURE[f.icon];
                  return (
                    <li key={f.title} className="flex items-start gap-2.5 sm:border-l sm:border-border sm:px-3 sm:first:border-l-0 sm:first:pl-0">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tint}`}>
                        <Icon size={19} strokeWidth={1.9} />
                      </span>
                      <span className="text-[13px] font-semibold leading-snug">
                        {f.title}
                        <span className="mt-0.5 block text-[11.5px] font-normal leading-snug text-muted">{f.text}</span>
                      </span>
                    </li>
                  );
                })}
              </motion.ul>

              <motion.div {...rise(0.24)} className="mt-6 lg:mt-[clamp(14px,2.8vh,30px)]">
                <div className="flex flex-col gap-4 rounded-[20px] border border-[#ebe8f7] bg-white/90 p-4 shadow-[0_24px_50px_-30px_rgba(60,40,160,.5)] sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-gradient-to-r from-[#ff3b4f] to-[#ff2e7e] px-2.5 py-1 text-[12.5px] font-extrabold tracking-wide text-white">{off}% OFF</span>
                      <span className="rounded-lg bg-[#fff0f3] px-2.5 py-1 text-[12px] font-semibold text-[#c0123a]">
                        {copy.offerTag}
                        {endsIn && <span className="font-mono tabular-nums"> · ends in {endsIn}</span>}
                      </span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2.5">
                      <span className="font-[family-name:var(--font-serif)] text-[38px] font-bold leading-none tracking-tight">{inr(pricing.offerPrice)}</span>
                      <span className="text-[15px] text-muted line-through decoration-[#c0392b]/60">{inr(pricing.listPrice)}</span>
                    </div>
                    <p className="mt-1 text-[12.5px] text-muted">Incl. GST</p>
                  </div>
                  <div className="sm:w-[250px] sm:shrink-0">
                    <EnrollCta onClick={onEnroll} full />
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-[#33363b]">
                  <span className="flex items-center gap-2 font-semibold">
                    <CalendarPage label={cohort.startsLabel} />
                    Classes start {cohort.startsLabel}
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold text-[#c0123a]">
                    <Flame size={15} /> Only {pricing.seatsLeft} seats left
                  </span>
                  <span className="flex items-center gap-1.5 text-muted">
                    <ShieldCheck size={14} /> Secure checkout via Cashfree
                  </span>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto w-full max-w-[500px] lg:max-w-none"
            >
              <div className="relative mx-auto aspect-[4/5] w-[78%] max-w-[360px] lg:mx-0 lg:ml-[2%] lg:w-[min(62%,40vh)] lg:max-w-none">
                <span aria-hidden className="absolute -right-[6%] top-[4%] h-[84%] w-[88%] rounded-[44px] bg-[linear-gradient(150deg,#e9e1ff,#cdbcff)]" />
                <span aria-hidden className="absolute -left-[4%] bottom-[8%] aspect-square w-[34%] rounded-[24px] bg-[linear-gradient(145deg,#ff9be8,#ff4fd8)] opacity-90" />
                <Image
                  src="/faculty/prasun-cutout.webp"
                  alt={faculty.founder.name}
                  fill
                  priority
                  sizes="(min-width: 1024px) 360px, 80vw"
                  className="object-contain object-bottom drop-shadow-[0_20px_28px_rgba(28,29,31,.25)] [mask-image:linear-gradient(to_bottom,#000_88%,transparent_100%)]"
                />
              </div>

              <p className="absolute right-[8%] top-0 hidden -rotate-3 font-[family-name:var(--font-serif)] text-[17px] font-semibold italic leading-tight text-accent lg:block">
                {copy.note}
              </p>

              <div className="mx-auto mt-5 w-full max-w-[340px] rounded-[20px] border border-[#ebe8f7] bg-white p-4 shadow-[0_24px_50px_-28px_rgba(60,40,160,.55)] lg:absolute lg:right-0 lg:top-[22%] lg:mt-0 lg:w-[min(46%,235px)]">
                <p className="text-[15px] font-bold">{faculty.founder.name}</p>
                <ul className="mt-3 flex flex-col gap-3">
                  {copy.credentials.map((c) => {
                    const Icon = CRED[c.icon];
                    return (
                      <li key={c.title} className="flex items-start gap-2.5">
                        <Icon size={18} className="mt-0.5 shrink-0 text-accent" strokeWidth={1.8} />
                        <span className="text-[13px] font-semibold leading-snug">
                          {c.title}
                          <span className="block text-[11.5px] font-normal leading-snug text-muted">{c.text}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border py-4 lg:py-[clamp(8px,1.8vh,18px)]">
            <p className="flex items-baseline gap-2">
              <span className="font-[family-name:var(--font-serif)] text-[26px] font-bold leading-none">{copy.strip.reachNumber}</span>
              <span className="text-[12.5px] text-muted">{copy.strip.reachLabel}</span>
            </p>
            <span aria-hidden className="hidden h-8 w-px bg-border sm:block" />
            <p className="text-[13px] font-semibold text-[#33363b]">{copy.strip.facts}</p>
            <span aria-hidden className="hidden h-8 w-px bg-border lg:block" />
            <p className="text-[12.5px] text-muted">
              {copy.strip.toolsLabel}: <span className="font-medium text-[#33363b]">{copy.strip.tools}</span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
