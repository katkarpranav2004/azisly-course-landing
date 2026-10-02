"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Award, Clock, Radio, ShieldCheck, Signal } from "lucide-react";
import { useCountdown } from "@/lib/useCountdown";
import { course } from "@/content/course";
import type { AudienceContent } from "@/content/types";

const META_ICONS = { level: Signal, live: Radio, cert: Award } as const;
const pad = (n: number) => String(n).padStart(2, "0");
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function CourseHero({ content, onEnroll }: { content: AudienceContent; onEnroll: () => void }) {
  const { pricing, faculty } = content;
  const off = Math.round((1 - pricing.offerPrice / pricing.listPrice) * 100);
  const left = useCountdown(pricing.offerEndsAt);

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(160deg,#0a1033_0%,#141a5c_55%,#2b2f8f_100%)] px-5 pb-16 text-white sm:pb-20">
      <div aria-hidden className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#5b5ff0]/25 blur-[120px]" />

      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between py-5">
        <span className="flex h-10 items-center rounded-xl bg-white px-3">
          <Image src="/logos/azisly.png" alt="Azisly.ai" width={120} height={35} className="h-[26px] w-auto" priority />
        </span>
        <div className="hidden items-center gap-7 text-[14px] text-white/80 md:flex">
          <a href="#outcomes" className="transition hover:text-white">Outcomes</a>
          <a href="#curriculum" className="transition hover:text-white">Curriculum</a>
          <a href="#instructor" className="transition hover:text-white">Instructor</a>
          <a href="#faq" className="transition hover:text-white">FAQ</a>
        </div>
        <button onClick={onEnroll} className="rounded-full bg-white px-4 py-2 text-[13.5px] font-semibold text-[#141a5c] transition hover:bg-white/90">
          Enroll now
        </button>
      </nav>

      <div className="relative z-10 mx-auto mt-8 grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-12 lg:mt-12 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <motion.span {...rise(0)} className="inline-flex items-center gap-1.5 rounded-md border border-white/25 bg-white/10 px-2.5 py-1 text-[12px] font-medium">
            <Clock size={12} /> {course.duration}
          </motion.span>
          <motion.h1 {...rise(0.05)} className="display mt-4 text-[clamp(38px,5.4vw,66px)] leading-[1.02]">
            {content.headline}
          </motion.h1>
          <motion.p {...rise(0.1)} className="mt-5 max-w-xl text-[16px] leading-relaxed text-white/80">
            {content.subheadline}
          </motion.p>

          <motion.div {...rise(0.15)} className="mt-7 inline-flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-3.5">
            {course.meta.map((m) => {
              const Icon = META_ICONS[m.icon as keyof typeof META_ICONS];
              return (
                <span key={m.label} className="flex items-center gap-2 text-[14px] text-white/90">
                  <Icon size={16} className="text-[#a5b0ff]" />
                  {m.label}
                </span>
              );
            })}
          </motion.div>

          <motion.div {...rise(0.2)} className="mt-8 flex flex-wrap items-end gap-x-6 gap-y-5">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="display text-[44px] leading-none">{inr(pricing.offerPrice)}</span>
                <span className="text-lg text-white/50 line-through">{inr(pricing.listPrice)}</span>
                <span className="rounded-md bg-[#ffd23f] px-2 py-0.5 text-[12px] font-bold text-[#1a1a3a]">{off}% OFF</span>
              </div>
              <p className="mt-2 text-[12.5px] text-white/60">
                Incl. GST · Launch price ends in{" "}
                <span className="font-mono tabular-nums text-white/90">
                  {left ? `${pad(left.days)}d ${pad(left.hours)}:${pad(left.minutes)}:${pad(left.seconds)}` : "--"}
                </span>
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={onEnroll} className="btn-primary px-7 py-4 text-[15px]">
                Enroll now <ArrowRight size={17} />
              </button>
              <span className="flex items-center justify-center gap-1.5 text-[11.5px] text-white/60">
                <ShieldCheck size={12} /> Secure checkout · Cashfree
              </span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto aspect-[4/3] w-full max-w-[520px] overflow-hidden rounded-[28px] border border-white/15 bg-[#0d1236] shadow-[0_40px_90px_-40px_rgba(0,0,0,.9)]"
        >
          <Image
            src={faculty.founder.photo}
            alt={faculty.founder.name}
            fill
            priority
            sizes="(min-width: 1024px) 520px, 100vw"
            className="object-cover object-[70%_18%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,16,51,.92)_0%,rgba(10,16,51,.65)_45%,transparent_75%)]" />
          <div className="absolute inset-y-0 left-0 flex w-[62%] flex-col justify-center pl-7">
            <span className="w-fit rounded bg-white px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-[#141a5c]">
              With {faculty.founder.name}
            </span>
            <p className="display mt-3 text-[clamp(28px,3.4vw,40px)] leading-[0.98]">
              AI <span className="text-[#a5b0ff]">Corporate</span> Analyst
            </p>
            <span className="mt-3 w-fit rounded bg-[#ffd23f] px-2 py-0.5 text-[11px] font-bold text-[#1a1a3a]">
              {course.duration}
            </span>
          </div>
          <div className="absolute bottom-4 left-5 rounded-full bg-black/40 px-3 py-1.5 text-[12px] backdrop-blur">
            {faculty.founder.credentials}
          </div>
          <div className="absolute bottom-4 right-5 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider backdrop-blur">
            {content.eyebrow}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
