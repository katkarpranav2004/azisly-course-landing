"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { course, courseContent } from "@/content/course";
import { cohort, faculty, MODULE_COUNT } from "@/content/shared";
import { useRange } from "@/lib/useRange";

const PINK = "#ff4fd8";
const PINK_GLOW = "0 0 6px rgba(255,79,216,.8)";
const PRICE = courseContent.pricing.offerPrice;
const PER_CLASS = Math.round(PRICE / MODULE_COUNT); // 5,999 / 13 is about 461
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const BUILDS = ["AI agent", "Dashboard agent", "Survey agent", "Prototype"];

const CHANNELS = [
  { code: "CH 01", from: "Pre-recorded", to: "Live", hint: "Not pre-recorded videos" },
  { code: "CH 02", from: "Usual price", to: "Under ₹500 / class", hint: "A fraction of the usual price" },
  { code: "CH 03", from: "Just watching", to: "Real work", hint: "Build, don't just watch" },
] as const;

/** A machined screw head for the console corners. */
function Screw({ className }: { className: string }) {
  return (
    <span aria-hidden className={`absolute flex h-[7px] w-[7px] items-center justify-center overflow-hidden rounded-full bg-[#2b2d30] ring-1 ring-white/10 ${className}`}>
      <span className="h-px w-full rotate-45 bg-white/25" />
    </span>
  );
}

function Led({ on, className = "" }: { on: boolean; className?: string }) {
  return (
    <span aria-hidden className={`relative inline-block h-[7px] w-[7px] shrink-0 rounded-full bg-white/15 ${className}`}>
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ background: PINK, boxShadow: `0 0 0 1px rgba(255,79,216,.35), ${PINK_GLOW}` }}
        initial={false}
        animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 1.6 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </span>
  );
}

/** Measures the cap's travel so drag can be pulled back exactly to the "another course" end. */
function useWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.offsetWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

function Fader({ p, locked, from, to, reduce }: { p: MotionValue<number>; locked: boolean; from: string; to: string; reduce: boolean }) {
  // The slider ends flush with the travel box and is pulled left: at rest nothing sits past the track,
  // and leftward offsets never create horizontal page scroll.
  const x = useRange(p, [0, 1], ["-100%", "0%"]);
  const fill = useRange(p, [0, 1], [0.04, 1]);
  const [travelRef, travel] = useWidth();

  return (
    <div className="w-full max-w-[560px]">
      <div className="flex items-end justify-between gap-3 font-mono text-[11px] uppercase leading-none tracking-[0.14em] sm:text-[12px]">
        <span className="relative min-w-0 text-white/50">
          {from}
          <motion.span
            aria-hidden
            className="absolute -left-[2px] -right-[4px] top-[calc(50%-0.5px)] h-[1.5px] origin-left rounded-full"
            style={{ background: PINK, boxShadow: "0 0 4px rgba(255,79,216,.7)" }}
            initial={false}
            animate={{ scaleX: locked ? 1 : 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
        </span>
        <motion.span
          className="flex min-w-0 items-center gap-1.5 text-right font-bold text-white"
          initial={false}
          animate={{ opacity: locked ? 1 : 0.35 }}
          transition={{ duration: 0.3 }}
        >
          <Led on={locked} className="!h-[6px] !w-[6px] sm:!h-[7px] sm:!w-[7px]" />
          {to}
        </motion.span>
      </div>

      {/* Track, LED meter and the fader cap */}
      <div className="relative mt-4 h-[12px] rounded-full bg-black/60 shadow-[inset_0_1px_2px_rgba(0,0,0,.8)] ring-1 ring-white/10 sm:mt-[18px] sm:h-[14px]">
        <div className="absolute inset-[3px] overflow-hidden rounded-full">
          <motion.div
            className="absolute inset-0 origin-left rounded-full bg-[linear-gradient(90deg,#5624d0,#ff4fd8)]"
            style={{ scaleX: fill }}
          />
          <div aria-hidden className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0_7px,#141516_7px_9px)]" />
        </div>
        <div ref={travelRef} className="absolute inset-y-0 left-[3px] right-[27px] sm:right-[33px]">
          <motion.div className="absolute inset-0" style={{ x }}>
            <motion.div
              drag={reduce ? false : "x"}
              dragConstraints={{ left: -travel, right: 0 }}
              dragElastic={0.08}
              dragSnapToOrigin
              dragTransition={{ bounceStiffness: 500, bounceDamping: 26 }}
              whileDrag={{ scale: 1.04 }}
              aria-hidden
              className="absolute -top-[12px] left-full h-9 w-6 rounded-[6px] bg-[linear-gradient(180deg,#3d3f44,#1f2023)] shadow-[0_6px_14px_-4px_rgba(0,0,0,.8),inset_0_1px_0_rgba(255,255,255,.12)] ring-1 ring-white/15 [@media(pointer:fine)]:cursor-grab [@media(pointer:fine)]:active:cursor-grabbing sm:-top-[15px] sm:h-11 sm:w-[30px] sm:rounded-[7px]"
            >
              <span className="absolute left-1/2 top-[5px] h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-white/20">
                <motion.span
                  className="absolute inset-0 rounded-full"
                  style={{ background: PINK, boxShadow: PINK_GLOW }}
                  initial={false}
                  animate={{ opacity: locked ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                />
              </span>
              <span className="absolute inset-x-[5px] top-1/2 flex -translate-y-1/2 flex-col items-stretch gap-[3px] sm:inset-x-[6px] sm:gap-[4px]">
                <span className="h-px bg-white/25" />
                <span className="h-px bg-white/25" />
                <span className="h-[2px] bg-white" />
                <span className="h-px bg-white/25" />
                <span className="h-px bg-white/25" />
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scale: 11 ticks across the cap's travel, the "this course" end in pink */}
      <div aria-hidden className="relative mx-[15px] mt-[18px] flex items-start justify-between sm:mx-[18px] sm:mt-[22px]">
        {Array.from({ length: 11 }, (_, i) => (
          <span
            key={i}
            className={`w-px ${i % 5 === 0 ? "h-2.5" : "h-1.5"} ${i === 10 ? "" : "bg-white/20"}`}
            style={i === 10 ? { background: PINK, boxShadow: PINK_GLOW } : undefined}
          />
        ))}
      </div>
    </div>
  );
}

/** CH1: the studio lamp flickers on, beside Prasun. */
function OnAir({ locked, play }: { locked: boolean; play: boolean }) {
  const { founder } = faculty;
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span className="relative flex h-[34px] items-center gap-2 rounded-[6px] border border-white/15 bg-black/40 px-3 font-mono text-[12px] font-bold tracking-[0.2em] shadow-[inset_0_1px_3px_rgba(0,0,0,.6)]">
        <span className="flex items-center gap-2 text-white/30">
          <span className="h-[7px] w-[7px] rounded-full bg-white/20" />
          ON AIR
        </span>
        <motion.span
          aria-hidden
          className="absolute inset-0 flex items-center gap-2 rounded-[6px] px-3"
          style={{ color: PINK, textShadow: "0 0 8px rgba(255,79,216,.9), 0 0 18px rgba(255,79,216,.5)" }}
          initial={false}
          animate={locked ? { opacity: play ? [0, 1, 0.2, 1, 0.6, 1] : 1 } : { opacity: 0 }}
          transition={locked && play ? { duration: 0.7, times: [0, 0.12, 0.24, 0.4, 0.6, 1], ease: "linear" } : { duration: 0.2 }}
        >
          <span className="h-[7px] w-[7px] rounded-full" style={{ background: PINK, boxShadow: PINK_GLOW }} />
          ON AIR
        </motion.span>
      </span>
      <span className="flex min-w-0 flex-1 basis-[180px] items-center gap-2.5">
        <motion.span
          className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full ring-2 ring-[#ff4fd8]"
          initial={false}
          animate={locked && play ? { scale: [1, 1.12, 1] } : { scale: 1 }}
          transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
        >
          <Image src={founder.photo} alt={founder.name} fill sizes="28px" className="object-cover object-[50%_18%]" />
        </motion.span>
        <span className="text-[12.5px] leading-snug text-white/65">
          All {MODULE_COUNT} classes, live on {cohort.platform}
        </span>
      </span>
    </div>
  );
}

/** CH2: the receipt maths, with the per-class figure dropping onto flip tiles. */
function Receipt({ locked, play, flips }: { locked: boolean; play: boolean; flips: number }) {
  const digits = String(PER_CLASS).split("");
  return (
    <div>
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1.5 font-mono text-[13px] leading-none">
        <span className="text-white/80">{inr(PRICE)}</span>
        <span className="text-white/45">÷ {MODULE_COUNT}</span>
        <span className="text-white/45">=</span>
        <span className="flex items-center gap-1">
          <span className="text-white/80">≈₹</span>
          {digits.map((d, i) => (
            <span
              key={i}
              className="relative flex h-[30px] w-[22px] items-center justify-center overflow-hidden rounded-[5px] bg-[#0f1011] text-[16px] font-bold tabular-nums ring-1 ring-white/10 shadow-[inset_0_-1px_0_rgba(255,255,255,.06)]"
            >
              <motion.span
                key={flips}
                initial={play ? { y: -12, opacity: 0.2 } : false}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.28, delay: i * 0.08, ease: "easeOut" }}
                className={locked ? "text-white" : "text-white/55"}
              >
                {d}
              </motion.span>
              <span aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-black/50" />
            </span>
          ))}
        </span>
      </p>
      <p className="mt-2.5 text-[12px] text-white/55">per live class · one time · GST included</p>
    </div>
  );
}

function BuildPill({ p, k, label }: { p: MotionValue<number>; k: number; label: string }) {
  const lit = useRange(p, [k * 0.25 - 0.08, k * 0.25], [0, 1]);
  return (
    <span className="relative flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[12px] font-semibold ring-1 ring-white/15">
      <span className="flex items-center gap-1.5 text-white/45">
        <span className="h-[6px] w-[6px] rounded-full bg-white/15" />
        {label}
      </span>
      <motion.span
        aria-hidden
        style={{ opacity: lit }}
        className="absolute inset-0 flex items-center gap-1.5 rounded-full bg-[#2a1f2c] px-2.5 text-white ring-1 ring-[#ff4fd8]/45"
      >
        <span className="h-[6px] w-[6px] rounded-full" style={{ background: PINK, boxShadow: PINK_GLOW }} />
        {label}
      </motion.span>
    </span>
  );
}

/** CH3: the four builds light up one by one as the cap travels. */
function Builds({ p }: { p: MotionValue<number> }) {
  return (
    <div className="flex flex-wrap gap-2">
      {BUILDS.map((b, i) => (
        <BuildPill key={b} p={p} k={i + 1} label={b} />
      ))}
    </div>
  );
}

function Channel({
  index,
  title,
  text,
  reduce,
  onLock,
}: {
  index: number;
  title: string;
  text: string;
  reduce: boolean;
  onLock: (i: number, v: boolean) => void;
}) {
  const ch = CHANNELS[index];
  const rowRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: rowRef, offset: ["start 95%", "end 82%"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 24, mass: 0.6 });

  // One stable value the visuals read. It starts locked so the server render (and any
  // visitor without JS) sees the final setting; scroll then takes over. Pinned under reduced motion.
  const p = useMotionValue(1);
  const [lockedState, setLocked] = useState(true);
  const [flips, setFlips] = useState(0);
  const locked = reduce || lockedState;

  useEffect(() => {
    if (reduce) {
      p.set(1);
      return;
    }
    // Once scroll is measured, snap (without animating) to where this row really is,
    // so rows below the fold reset quietly and then get pushed as they arrive.
    let id = requestAnimationFrame(() => {
      id = requestAnimationFrame(() => {
        const v = scrollYProgress.get();
        smooth.jump(v);
        p.set(v);
      });
    });
    return () => cancelAnimationFrame(id);
  }, [reduce, p, smooth, scrollYProgress]);

  useMotionValueEvent(smooth, "change", (v) => {
    if (!reduce) p.set(v);
  });

  // Hysteresis: lock near the end, only unlock once the cap is well back.
  useMotionValueEvent(p, "change", (v) => {
    if (!lockedState && v > 0.97) {
      setLocked(true);
      setFlips((n) => n + 1);
    } else if (lockedState && v < 0.6) setLocked(false);
  });

  const play = flips > 0 && !reduce;

  useEffect(() => onLock(index, locked), [index, locked, onLock]);

  let readout: ReactNode;
  if (index === 0) readout = <OnAir locked={locked} play={play} />;
  else if (index === 1) readout = <Receipt locked={locked} play={play} flips={flips} />;
  else readout = <Builds p={p} />;

  return (
    <div
      ref={rowRef}
      className={`grid grid-cols-[minmax(0,1fr)] gap-y-5 px-5 py-6 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-x-14 lg:gap-y-0 lg:px-10 ${
        index > 0 ? "border-t border-white/10" : ""
      }`}
    >
      <div className="min-w-0 lg:col-start-1 lg:row-start-1 lg:self-end">
        <p className="font-mono text-[11px] tracking-[0.2em]" style={{ color: PINK }}>
          {ch.code}
          <span className="sr-only">: {ch.hint}</span>
        </p>
        <h3 className="mt-1.5 font-[family-name:var(--font-serif)] text-[21px] font-bold leading-tight text-white sm:mt-2 sm:text-[26px]">{title}</h3>
      </div>

      <div className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
        <span className="sr-only">
          From {ch.from} to {ch.to}.
        </span>
        <Fader p={p} locked={locked} from={ch.from} to={ch.to} reduce={reduce} />
        <div className="mt-4 sm:mt-5">{readout}</div>
      </div>

      <p className="min-w-0 max-w-[440px] text-[14.5px] leading-relaxed text-white/70 sm:text-[15.5px] lg:col-start-1 lg:row-start-2 lg:mt-2.5 lg:self-start">
        {text}
      </p>
    </div>
  );
}

/** USP section as a studio mixing desk: each fader is pushed from "another course" to this one, and locks. */
export default function WhyKinetic() {
  const reduce = useReducedMotion() ?? false;
  const [locks, setLocks] = useState([true, true, true]);
  const onLock = useCallback((i: number, v: boolean) => {
    setLocks((prev) => (prev[i] === v ? prev : prev.map((x, j) => (j === i ? v : x))));
  }, []);
  const count = locks.filter(Boolean).length;

  return (
    <section className="px-5 pb-20 pt-16 sm:pb-24 sm:pt-20">
      <div className="mx-auto max-w-6xl">
        {/* Rises into place from a fully visible state, so the heading never waits on JS. */}
        <motion.h2
          initial={reduce ? false : { y: 14 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="display text-center text-[clamp(28px,4vw,44px)] leading-[1.05]"
        >
          Why this, <span className="accent-text">not another course</span>
        </motion.h2>

        <div className="relative mx-auto mt-8 max-w-6xl rounded-[24px] bg-[#1c1d1f] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.06),0_30px_60px_-30px_rgba(28,29,31,.6)] ring-1 ring-white/10 sm:mt-10 sm:rounded-[28px]">
          <Screw className="left-[12px] top-[12px] sm:left-[14px] sm:top-[14px]" />
          <Screw className="right-[12px] top-[12px] sm:right-[14px] sm:top-[14px]" />
          <Screw className="bottom-[12px] left-[12px] sm:bottom-[14px] sm:left-[14px]" />
          <Screw className="bottom-[12px] right-[12px] sm:bottom-[14px] sm:right-[14px]" />

          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-7 py-3.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45 sm:px-10 sm:text-[11px]">
            <span className="min-w-0 truncate">Course settings</span>
            <span className="flex shrink-0 items-center gap-2.5" aria-label={`${count} of 3 settings locked`}>
              <span>Locked</span>
              <span className="flex items-center gap-1.5">
                {locks.map((on, i) => (
                  <Led key={i} on={on} />
                ))}
              </span>
              <span className="tabular-nums text-white/70">
                {count}/3
              </span>
            </span>
          </div>

          {course.usp.map((u, i) => (
            <Channel key={u.title} index={i} title={u.title} text={u.text} reduce={reduce} onLock={onLock} />
          ))}
        </div>
      </div>
    </section>
  );
}
