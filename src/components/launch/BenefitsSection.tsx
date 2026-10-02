"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { animate, motion, useInView } from "framer-motion";
import { BarChart3, Bot, Clock, Presentation, type LucideIcon } from "lucide-react";
import { benefits, type Benefit } from "@/content/corporate-launch";

const ICONS: Record<Benefit["icon"], LucideIcon> = {
  clock: Clock,
  chart: BarChart3,
  bot: Bot,
  presentation: Presentation,
};

function Counter({ value, prefix = "", suffix = "", label }: { value: number; prefix?: string; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, { duration: 1.4, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, value]);

  return (
    <div ref={ref} className="text-center">
      <p className="display text-[clamp(30px,4vw,48px)] leading-none tabular-nums">
        <span className="text-[0.6em] text-white/60">{prefix}</span>
        {n}
        <span className="text-[0.45em] text-white/70">{suffix}</span>
      </p>
      <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-[#9ff2d6]/70">{label}</p>
    </div>
  );
}

function BenefitCard({ b, i }: { b: Benefit; i: number }) {
  const Icon = ICONS[b.icon];
  const [from, to] = b.gradient;

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.88 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 140, damping: 16, delay: i * 0.09 }}
      whileHover={{ y: -8 }}
      onMouseMove={onMove}
      className="group relative h-full overflow-hidden rounded-[22px] border border-white/10 bg-[#071420]/80 p-6 backdrop-blur"
      style={{ ["--c1" as string]: from, ["--c2" as string]: to }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(260px circle at var(--mx,50%) var(--my,0%), ${from}33, transparent 70%)` }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, ${from}, ${to})` }}
      />
      <div
        aria-hidden
        className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-30 blur-3xl transition-opacity duration-300 group-hover:opacity-60"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      />

      <span
        className="relative flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})`, boxShadow: `0 12px 30px -10px ${from}` }}
      >
        <Icon size={22} />
      </span>
      <h3 className="relative mt-5 text-[19px] font-bold leading-snug">{b.title}</h3>
      <p className="relative mt-2 text-[14.5px] leading-relaxed text-white/75">{b.line}</p>
      <div className="relative grid grid-rows-[1fr] transition-all duration-500 sm:grid-rows-[0fr] sm:group-hover:grid-rows-[1fr]">
        <p className="overflow-hidden text-[13.5px] leading-relaxed text-white/55">
          <span className="block pt-2">{b.detail}</span>
        </p>
      </div>
      <span
        className="relative mt-5 inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold"
        style={{ color: to, background: `${to}1a`, boxShadow: `inset 0 0 0 1px ${to}40` }}
      >
        {b.source}
      </span>
    </motion.div>
  );
}

export default function BenefitsSection() {
  return (
    <section
      data-offer-zone="benefits"
      className="relative overflow-hidden px-5 pb-20 pt-16 sm:pb-28 sm:pt-20"
      style={{ background: "linear-gradient(180deg, #043a2c 0%, #052b2e 22%, #06142a 60%, #050816 100%)" }}
    >
      <div aria-hidden className="absolute left-1/4 top-20 h-80 w-80 rounded-full bg-[#10b981]/20 blur-[120px]" />
      <div aria-hidden className="absolute right-1/4 top-40 h-80 w-80 rounded-full bg-[#22d3ee]/15 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="eyebrow text-[#6ee7b7]">{benefits.eyebrow}</p>
          <h2 className="display mt-3 text-[clamp(34px,5vw,64px)] leading-none">
            What you&apos;ll{" "}
            <span className="bg-[linear-gradient(100deg,#6ee7b7,#22d3ee,#8b9cff)] bg-clip-text text-transparent">
              actually gain
            </span>
          </h2>
        </motion.div>

        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          {benefits.counters.map((c) => (
            <Counter key={c.label} {...c} />
          ))}
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.cards.map((b, i) => (
            <div key={b.title} className="float-card" style={{ animationDelay: `${-i * 1.6}s`, animationDuration: "8s" }}>
              <BenefitCard b={b} i={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
