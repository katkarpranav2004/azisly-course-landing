"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BarChart3, Briefcase, FileSpreadsheet, FileText, Globe2, GraduationCap, ShieldCheck, Star, Users, Video, Zap } from "lucide-react";
import { cohort } from "@/content/shared";
import { heroCombined as copy } from "@/content/hero-combined";
import { CalendarPage, EnrollCta } from "./HeroStudio";
import type { AudienceContent } from "@/content/types";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const PILL = { video: Video, file: FileText, users: Users } as const;

const FEATURE = {
  excel: { Icon: FileSpreadsheet, tint: "bg-[#e3f5ea] text-[#1d7a45]" },
  reports: { Icon: FileText, tint: "bg-[#f1ecff] text-[#5624d0]" },
  agents: { Icon: Zap, tint: "bg-[#fff3dc] text-[#e08a00]" },
  dashboards: { Icon: BarChart3, tint: "bg-[#e8f1ff] text-[#2563c9]" },
} as const;

const CRED = { school: GraduationCap, work: Briefcase, globe: Globe2, years: Users } as const;

/** Hero of the combined page, built to the approved reference design. */
export default function HeroCombined({ content, onEnroll }: { content: AudienceContent; onEnroll: () => void }) {
  const { pricing, faculty } = content;
  const off = Math.round((1 - pricing.offerPrice / pricing.listPrice) * 100);
  const startsOn = `${cohort.startsLabel} ${new Date(cohort.startsAt).getFullYear()}`;

  return (
    <section className="relative overflow-hidden bg-white px-4 sm:px-5 lg:flex lg:min-h-[100svh] lg:flex-col">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_75%_at_80%_40%,rgba(124,77,255,.12),transparent_70%)]" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col lg:flex-1">
        <div className="flex flex-wrap items-center justify-between gap-3 pt-5 lg:pt-[clamp(14px,3vh,34px)]">
          <div className="flex items-center gap-3">
            <span className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-accent px-3.5 py-1.5 text-[13px] font-semibold text-white">
              <Video size={14} /> {copy.livePill}
            </span>
            <span aria-hidden className="hidden h-4 w-px bg-border sm:block" />
            <span className="text-[11.5px] font-semibold uppercase tracking-[0.2em] text-muted sm:text-[12.5px]">{copy.eyebrow}</span>
          </div>
          <ul className="hidden gap-2 lg:flex">
            {copy.topPills.map((p) => {
              const Icon = PILL[p.icon];
              return (
                <li key={p.label} className="flex items-center gap-2 rounded-full border border-[#ebe8f7] bg-white/90 px-3.5 py-1.5 text-[12.5px] font-medium shadow-[0_8px_20px_-14px_rgba(60,40,160,.45)]">
                  <Icon size={14} className="text-accent" /> {p.label}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-8 py-6 lg:flex-1 lg:grid-cols-[1.12fr_.88fr] lg:gap-6 lg:pb-[clamp(10px,2.4vh,26px)] lg:pt-[clamp(8px,1.6vh,20px)]">
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

            <motion.ul {...rise(0.18)} className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4 sm:gap-0 lg:mt-[clamp(12px,2.4vh,26px)] lg:max-w-[640px]">
              {copy.features.map((f) => {
                const { Icon, tint } = FEATURE[f.icon];
                return (
                  <li key={f.title} className="flex flex-col items-center gap-2 text-center sm:border-l sm:border-border sm:px-3 sm:first:border-l-0">
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tint}`}>
                      <Icon size={20} strokeWidth={1.9} />
                    </span>
                    <span className="text-[13px] font-semibold leading-snug">{f.title}</span>
                  </li>
                );
              })}
            </motion.ul>

            <motion.div {...rise(0.24)} className="mt-6 lg:mt-[clamp(14px,2.8vh,30px)]">
              <div className="flex flex-col gap-4 rounded-[20px] border border-[#ebe8f7] bg-white/90 p-4 shadow-[0_24px_50px_-30px_rgba(60,40,160,.5)] sm:flex-row sm:items-center sm:gap-6 sm:p-5">
                <div className="sm:shrink-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-gradient-to-r from-[#ff3b4f] to-[#ff2e7e] px-2.5 py-1 text-[12.5px] font-extrabold tracking-wide text-white">{off}% OFF</span>
                    <span className="rounded-lg bg-[#fff0f3] px-2.5 py-1 text-[12px] font-semibold text-[#c0123a]">{copy.offerTag}</span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2.5">
                    <span className="font-[family-name:var(--font-serif)] text-[38px] font-bold leading-none tracking-tight">{inr(pricing.offerPrice)}</span>
                    <span className="text-[15px] text-muted line-through decoration-[#c0392b]/60">{inr(pricing.listPrice)}</span>
                  </div>
                  <p className="mt-1 text-[12.5px] text-muted">Incl. GST</p>
                </div>
                <span aria-hidden className="hidden h-16 w-px bg-border sm:block" />
                <div className="min-w-0 flex-1">
                  <EnrollCta onClick={onEnroll} full />
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-[#33363b]">
                    <span className="flex items-center gap-2">
                      <CalendarPage label={cohort.startsLabel} />
                      Classes start {startsOn}
                    </span>
                    <span className="flex items-center gap-1.5 font-semibold text-[#c0123a]">
                      <Users size={14} /> Only {pricing.seatsLeft} seats left
                    </span>
                    <span className="flex items-center gap-1.5 text-muted">
                      <ShieldCheck size={14} /> Secure checkout via Cashfree
                    </span>
                  </div>
                </div>
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
              <Image
                src="/faculty/prasun-cutout.webp"
                alt={faculty.founder.name}
                fill
                priority
                sizes="(min-width: 1024px) 360px, 80vw"
                className="object-contain object-bottom drop-shadow-[0_20px_28px_rgba(28,29,31,.25)] [mask-image:linear-gradient(to_bottom,#000_88%,transparent_100%)]"
              />
            </div>

            <div className="absolute right-[24%] top-0 hidden items-start gap-1 lg:flex">
              <svg aria-hidden viewBox="0 0 60 50" className="mt-6 h-9 w-11 -scale-x-100 text-accent">
                <path d="M4 8 C 30 0, 52 18, 50 44 M50 44 L 41 34 M50 44 L 58 33" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="-rotate-3 font-[family-name:var(--font-serif)] text-[17px] font-semibold italic leading-tight text-accent">
                Learn directly
                <br />
                from Prasun
              </p>
            </div>

            <div className="mx-auto mt-5 w-full max-w-[340px] rounded-[20px] border border-[#ebe8f7] bg-white p-4 shadow-[0_24px_50px_-28px_rgba(60,40,160,.55)] lg:absolute lg:right-0 lg:top-[22%] lg:mt-0 lg:w-[min(46%,235px)]">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[15px] font-bold">{faculty.founder.name}</p>
                <span aria-hidden className="flex h-[18px] w-[18px] items-center justify-center rounded-[4px] bg-[#0a66c2] text-[10px] font-bold leading-none text-white">in</span>
              </div>
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

        <div className="grid grid-cols-1 items-center gap-x-8 gap-y-4 border-t border-border py-4 sm:grid-cols-2 lg:grid-cols-[auto_auto_1fr] lg:py-[clamp(8px,1.8vh,18px)]">
          <div className="flex items-center gap-3">
            <span className="flex -space-x-2.5">
              {copy.strip.avatars.map((n) => (
                <Image key={n} src={`/testimonials/learner-${n}.webp`} alt="" width={36} height={36} className="h-9 w-9 rounded-full border-2 border-white object-cover" />
              ))}
            </span>
            <p className="leading-tight">
              <span className="block font-[family-name:var(--font-serif)] text-[22px] font-bold">{copy.strip.reachNumber}</span>
              <span className="text-[12px] text-muted">{copy.strip.reachLabel}</span>
            </p>
          </div>
          <div className="flex items-center gap-3 lg:border-l lg:border-border lg:pl-8">
            <span>
              <span className="flex gap-0.5 text-[#f5b301]">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                ))}
              </span>
              <span className="mt-0.5 block text-[12px] text-muted">
                <b className="text-[#33363b]">{copy.strip.rating}</b> {copy.strip.ratingLabel}
              </span>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:col-span-2 lg:col-span-1 lg:border-l lg:border-border lg:pl-8">
            <span className="text-[12px] text-muted">{copy.strip.trustedLabel}</span>
            <span className="flex items-center gap-1.5 text-[12px] font-medium text-[#33363b]">
              <Image src="/logos/iit-kgp.svg" alt="" width={28} height={31} className="h-8 w-auto" /> IIT Kharagpur
            </span>
            <Image src="/logos/oyo.svg" alt="OYO" width={80} height={32} className="h-7 w-auto" />
            <Image src="/logos/lbs.svg" alt="London Business School" width={80} height={32} className="h-8 w-auto" />
            <span className="text-[12px] text-muted">{copy.strip.more}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
