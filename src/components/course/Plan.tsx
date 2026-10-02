"use client";

import { ArrowRight, CalendarDays, Check, ShieldCheck } from "lucide-react";
import Reveal from "@/components/Reveal";
import { useCountdown } from "@/lib/useCountdown";
import { cohort, MODULE_COUNT } from "@/content/shared";
import { CTA } from "@/content/course";
import { useStudio } from "./StudioContext";
import type { AudienceContent } from "@/content/types";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const pad = (n: number) => String(n).padStart(2, "0");

export default function Plan({ content, onEnroll }: { content: AudienceContent; onEnroll: () => void }) {
  const { pricing } = content;
  const off = Math.round((1 - pricing.offerPrice / pricing.listPrice) * 100);
  const perSession = Math.round(pricing.offerPrice / MODULE_COUNT);
  const left = useCountdown(pricing.offerEndsAt);
  const { includes } = useStudio().copy;

  return (
    <section id="pricing" className="scroll-mt-6 px-5 pb-20 sm:pb-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="display text-center text-[clamp(30px,4.4vw,50px)] leading-[1.05]">
            Get <span className="accent-text">lifetime access</span>
          </h2>
          <p className="mt-3 text-center text-[15.5px] text-muted">One program. One price. Everything included.</p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-12 grid grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[28px] shadow-[0_30px_70px_-35px_rgba(30,40,110,.55)] md:grid-cols-2">
            <div className="panel-deep p-8 text-white sm:p-10">
              <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">Launch offer · {off}% off</span>
              <p className="mt-5 text-[18px] font-bold">AI Corporate Analyst</p>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="display text-[56px] leading-none">{inr(pricing.offerPrice)}</span>
                <span className="text-lg text-white/50 line-through">{inr(pricing.listPrice)}</span>
              </div>
              <p className="mt-2 text-[13.5px] text-white/75">
                Incl. GST · that&apos;s just {inr(perSession)} per live session
              </p>
              <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[12.5px] font-medium">
                <CalendarDays size={13} /> Classes start {cohort.startsLabel} · Live on {cohort.platform}
              </p>
              <button onClick={onEnroll} className="btn-primary mt-6 w-full py-3.5 text-[15px]">
                {CTA} <ArrowRight size={16} />
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-white/70">
                <ShieldCheck size={12} /> Secure checkout · Cashfree
              </p>
              <p className="mt-5 text-center text-[12.5px] text-white/70">
                Launch price ends in{" "}
                <span className="font-mono tabular-nums text-white">
                  {left ? `${pad(left.days)}d ${pad(left.hours)}:${pad(left.minutes)}:${pad(left.seconds)}` : "--"}
                </span>
              </p>
            </div>
            <div className="bg-white p-8 sm:p-10">
              <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-muted">What&apos;s included</p>
              <ul className="mt-5 flex flex-col gap-3.5">
                {includes.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[15px]">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--chip-bg)] text-accent">
                      <Check size={14} strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
