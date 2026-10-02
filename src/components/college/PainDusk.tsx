"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Confetti from "./Confetti";
import { pain } from "@/content/college-launch";

type PainLine = (typeof pain.lines)[number];

const N = pain.lines.length;
/** Extra scroll after the last cut so the "cleared" message gets a moment. */
const TAIL = 0.7;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function Face({ line }: { line: PainLine }) {
  const [before, after] = line.text.split(line.hit);
  return (
    <div className="flex h-full items-center gap-5 rounded-[26px] border border-[#ff8cb0]/30 bg-[linear-gradient(150deg,#4a1240,#2a0a30)] px-6 py-6 shadow-[0_30px_60px_-30px_rgba(0,0,0,.8)] sm:px-8">
      <span className="text-[40px] sm:text-[48px]">{line.emoji}</span>
      <p className="text-[clamp(20px,2.4vw,30px)] font-semibold leading-tight tracking-tight text-[#ffe4ee]">
        {before}
        <span className="text-[#ff6b9a] [text-shadow:0_0_22px_rgba(255,107,154,.5)]">{line.hit}</span>
        {after}
      </p>
    </div>
  );
}

function SlicedCard({ line, i, a }: { line: PainLine; i: number; a: MotionValue<number> }) {
  // depth > 0: waiting in the deck. depth in (-1, 0): being cut. depth <= -1: gone.
  const depth = useTransform(a, (v) => i - v);
  const t = useTransform(depth, (d) => clamp01(-d));
  const slash = useTransform(t, (v) => clamp01((v - 0.28) / 0.22));
  const split = useTransform(t, (v) => clamp01((v - 0.5) / 0.5));

  const deckY = useTransform(depth, (d) => Math.min(Math.max(d, 0), 3) * 20);
  const deckScale = useTransform(depth, (d) => 1 - Math.min(Math.max(d, 0), 3) * 0.06);
  const deckOpacity = useTransform(depth, (d) => (d > 3.2 ? 0 : d <= -1 ? 0 : 1));
  const shade = useTransform(depth, (d) => Math.min(Math.max(d, 0), 3) * 0.22);

  const wholeOpacity = useTransform(t, (v) => (v < 0.5 ? 1 : 0));
  const halfOpacity = useTransform(split, (s) => (s > 0 ? clamp01(1 - s * 1.6) : 0));
  const topX = useTransform(split, (s) => s * -150);
  const topY = useTransform(split, (s) => s * -120);
  const topR = useTransform(split, (s) => s * -10);
  const botX = useTransform(split, (s) => s * 150);
  const botY = useTransform(split, (s) => s * 170);
  const botR = useTransform(split, (s) => s * 12);

  const lineOpacity = useTransform(t, (v) => (v > 0.28 && v < 0.62 ? 1 : 0));
  const scissorsLeft = useTransform(slash, (s) => `${s * 100}%`);
  const scissorsTop = useTransform(slash, (s) => `${62 - s * 24}%`);

  return (
    <motion.div
      style={{ y: deckY, scale: deckScale, opacity: deckOpacity, zIndex: N - i }}
      className="absolute inset-x-0 top-0 h-[200px] origin-top sm:h-[220px]"
    >
      <motion.div style={{ opacity: wholeOpacity }} className="absolute inset-0">
        <Face line={line} />
        <motion.div style={{ opacity: shade }} className="pointer-events-none absolute inset-0 rounded-[26px] bg-[#14051f]" />
      </motion.div>

      <motion.div
        style={{ opacity: halfOpacity, x: topX, y: topY, rotate: topR }}
        className="absolute inset-0 [clip-path:polygon(0_0,100%_0,100%_38%,0_62%)]"
      >
        <Face line={line} />
      </motion.div>
      <motion.div
        style={{ opacity: halfOpacity, x: botX, y: botY, rotate: botR }}
        className="absolute inset-0 [clip-path:polygon(0_62%,100%_38%,100%_100%,0_100%)]"
      >
        <Face line={line} />
      </motion.div>

      <motion.svg style={{ opacity: lineOpacity }} className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.line
          x1="0"
          y1="62"
          x2="100"
          y2="38"
          stroke="#fff"
          strokeWidth="0.9"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: slash, filter: "drop-shadow(0 0 6px #ff6b9a) drop-shadow(0 0 12px #fff)" }}
        />
      </motion.svg>
      <motion.span
        aria-hidden
        style={{ left: scissorsLeft, top: scissorsTop, opacity: lineOpacity }}
        className="pointer-events-none absolute -ml-5 -mt-5 text-[34px] drop-shadow-[0_0_12px_rgba(255,255,255,.8)]"
      >
        ✂️
      </motion.span>
    </motion.div>
  );
}

function Tally({ a }: { a: MotionValue<number> }) {
  const [cut, setCut] = useState(0);
  useMotionValueEvent(a, "change", (v) => {
    const next = Math.min(N, Math.max(0, Math.floor(v + 0.5)));
    if (next !== cut) setCut(next);
  });

  return (
    <div className="mt-8">
      <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.22em] text-[#ffb3c8]">
        ✂️ <span className="tabular-nums">{String(cut).padStart(2, "0")}</span> / {String(N).padStart(2, "0")} cut down
      </p>
      <div className="mt-3 flex gap-1.5">
        {pain.lines.map((l, i) => (
          <span
            key={l.text}
            className={`h-2 flex-1 rounded-full transition-colors duration-300 ${i < cut ? "bg-gradient-to-r from-[#ffb347] to-[#ff2e63]" : "bg-white/12"}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function PainDusk() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const a = useTransform(scrollYProgress, (v) => v * (N + TAIL));
  const clearedOpacity = useTransform(a, (v) => clamp01((v - N + 0.15) / 0.3));
  const clearedScale = useTransform(a, (v) => 0.9 + clamp01((v - N + 0.15) / 0.3) * 0.1);
  const [burst, setBurst] = useState(0);
  useMotionValueEvent(a, "change", (v) => {
    if (v > N && burst === 0) setBurst(1);
  });

  const bg = { background: "radial-gradient(ellipse 80% 60% at 30% 0%, #6b1240 0%, #3a0b35 45%, #22062a 100%)" };

  if (reduce) {
    return (
      <section data-offer-zone="pain" className="px-5 py-20" style={bg}>
        <div className="mx-auto max-w-3xl">
          <h2 className="display text-[clamp(38px,6vw,76px)] leading-none">{pain.heading}</h2>
          <ul className="mt-8 grid gap-3">
            {pain.lines.map((l) => (
              <li key={l.text} className="h-[200px]">
                <Face line={l} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} data-offer-zone="pain" className="relative" style={{ ...bg, height: `calc(100svh + ${N * 55}vh)` }}>
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden px-5">
        <div aria-hidden className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#8b2ff7]/40 to-transparent" />
        <div aria-hidden className="absolute -left-32 top-1/2 h-80 w-80 rounded-full bg-[#ff2e63]/15 blur-[110px]" />
        <div aria-hidden className="absolute -right-32 top-10 h-80 w-80 rounded-full bg-[#ff7a18]/10 blur-[110px]" />

        <div className="relative mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div>
            <p className="eyebrow text-[#ff9ec0]">{pain.eyebrow}</p>
            <h2 className="display mt-3 text-[clamp(44px,7vw,104px)] leading-[0.92] [text-shadow:0_0_50px_rgba(255,46,99,.4)]">
              {pain.heading}
            </h2>
            <p className="mt-5 max-w-sm text-[16px] text-[#ffb3c8]/85">{pain.sub}</p>
            <Tally a={a} />
          </div>

          <div className="relative h-[290px] sm:h-[320px]">
            {pain.lines.map((line, i) => (
              <SlicedCard key={line.text} line={line} i={i} a={a} />
            ))}
            <motion.div
              style={{ opacity: clearedOpacity, scale: clearedScale }}
              className="absolute inset-x-0 top-0 flex h-[200px] flex-col items-center justify-center text-center sm:h-[220px]"
            >
              <Confetti burst={burst} />
              <p className="display text-[clamp(26px,3.2vw,40px)] leading-tight">{pain.cleared}</p>
              <p className="mt-3 text-[15px] text-[#ffb3c8]">{pain.clearedSub}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
