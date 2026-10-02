"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import { benefits } from "@/content/college-launch";

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
      <p className="display text-[clamp(30px,4vw,46px)] leading-none tabular-nums">
        <span className="text-[0.6em] text-white/75">{prefix}</span>
        {n}
        <span className="text-[0.45em] text-white/80">{suffix}</span>
      </p>
      <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/90">{label}</p>
    </div>
  );
}

export default function BenefitsSunset() {
  return (
    <section
      data-offer-zone="benefits"
      className="relative overflow-hidden px-5 pb-24 pt-16 sm:pt-20"
      style={{ background: "linear-gradient(180deg,#ff9a4d 0%,#ff5e8e 35%,#b84cf0 75%,#7b3ff2 100%)" }}
    >
      <div aria-hidden className="absolute left-1/4 top-0 h-80 w-80 rounded-full bg-white/25 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="eyebrow text-white/90">{benefits.eyebrow}</p>
          <h2 className="display mt-3 text-[clamp(32px,5vw,60px)] leading-none">{benefits.heading}</h2>
        </motion.div>

        <div className="mx-auto mt-9 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          {benefits.counters.map((c) => (
            <Counter key={c.label} {...c} />
          ))}
        </div>

        <div className="mt-12 grid gap-4 [perspective:1200px] sm:grid-cols-2 lg:grid-cols-4">
          {benefits.cards.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, rotateY: -90, y: 30 }}
              whileInView={{ opacity: 1, rotateY: 0, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", stiffness: 110, damping: 14, delay: i * 0.12 }}
              whileHover={{ y: -10, rotate: i % 2 ? 1.5 : -1.5 }}
              className="card group h-full p-6"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/30 text-[28px] shadow-[inset_0_1px_0_rgba(255,255,255,.6)] transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-[-10deg] group-hover:scale-110">
                {b.emoji}
              </span>
              <h3 className="mt-5 font-[family-name:var(--font-unbounded)] text-[17px] font-bold leading-snug">{b.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-white/90">{b.line}</p>
              <span className="mt-4 inline-block rounded-full bg-white/25 px-2.5 py-1 text-[11px] font-bold">{b.source}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
