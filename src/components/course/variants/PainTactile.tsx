"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { course } from "@/content/course";
import { MODULE_COUNT } from "@/content/shared";

type Row = (typeof course.painSolutions)[number];

// Crooked notes, square cards: the tilt is the "stuck", the straight card is the "sorted".
const ROT = [-2.2, 1.4, -1, 1.8, -1.5];
const STAMP_ROT = [-12, 9, -6, 14, -9];
// The phrase in each fix that gets the mint highlighter.
const MARKS = [
  "AI agents you build yourself",
  "RTCO framework",
  "core tools teams actually use",
  "your own agent, a dashboard and a working prototype",
  "four real builds",
];
const SUBLINE = "Five things that keep people stuck, and the live class that sorts each one.";
const TAPE = ["All 5 sorted", `in ${MODULE_COUNT} live classes`];

const EASE = [0.22, 1, 0.36, 1] as const;
const FALLBACK_CSS =
  "@keyframes pt-show{to{opacity:1;transform:none}}.pt-root:not([data-pt-live]) [data-pt]{animation:pt-show .3s 1.2s forwards}";
const SHADOW = "shadow-[0_10px_24px_-16px_rgba(28,29,31,.5)]";
const RULED: CSSProperties = { backgroundImage: "repeating-linear-gradient(to bottom, transparent 0 var(--rule-gap), #edf1f6 var(--rule-gap) var(--rule))" };

const modNumbers = (source: string) => source.replace(/^Modules? /, "").replace(" to ", "-").replace(" and ", "+");

const subscribeWide = (cb: () => void) => {
  const mq = window.matchMedia("(min-width: 1024px)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
function useWide() {
  return useSyncExternalStore(subscribeWide, () => window.matchMedia("(min-width: 1024px)").matches, () => false);
}

/** In view once; also true if the block was already scrolled past at mount, so nothing stays hidden. */
function useShown<T extends Element>(margin: `${number}px ${number}px ${number}% ${number}px` | "0px") {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, margin });
  const [past, setPast] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (el && el.getBoundingClientRect().bottom < 0) setPast(true);
  }, []);
  return [ref, inView || past] as const;
}

function Marked({ text, mark }: { text: string; mark: string }) {
  const at = text.indexOf(mark);
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span
        className="-mx-0.5 px-0.5 [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
        style={{ backgroundImage: "linear-gradient(transparent 56%, rgba(111,216,185,.5) 56%)" }}
      >
        {mark}
      </span>
      {text.slice(at + mark.length)}
    </>
  );
}

/** Round rubber stamp: SORTED around the rim, the module numbers in the middle. */
function Stamp({ source, rot }: { source: string; rot: number }) {
  const pathId = `stamp-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg aria-hidden viewBox="0 0 80 80" className="h-full w-full overflow-visible text-[#5624d0]" style={{ transform: `rotate(${rot}deg)` }}>
      <defs>
        <path id={pathId} d="M40 12 a28 28 0 1 1 0 56 a28 28 0 1 1 0 -56" />
      </defs>
      <circle cx="40" cy="40" r="37" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="40" cy="40" r="25.5" fill="none" stroke="currentColor" strokeWidth="1.1" strokeDasharray="2 1.6" />
      <text fill="currentColor" className="font-mono" fontSize="9" fontWeight="800">
        <textPath href={`#${pathId}`} textLength="170" lengthAdjust="spacing">
          SORTED • SORTED • SORTED •
        </textPath>
      </text>
      <text x="40" y="34.5" textAnchor="middle" fill="currentColor" className="font-mono" fontSize="6.4" fontWeight="800" letterSpacing="1.2">
        MOD
      </text>
      <text x="40" y="51" textAnchor="middle" fill="currentColor" fontSize={modNumbers(source).length > 3 ? 15 : 17} fontWeight="700" style={{ fontFamily: "var(--font-serif)" }}>
        {modNumbers(source)}
      </text>
      {/* worn ink: white specks punch through where the rubber missed */}
      <g fill="#fff" opacity=".5">
        <circle cx="18" cy="26" r="1" />
        <circle cx="61" cy="20" r=".8" />
        <circle cx="66" cy="52" r="1.1" />
        <circle cx="27" cy="63" r=".7" />
        <circle cx="47" cy="11" r=".6" />
        <circle cx="52" cy="58" r=".6" />
      </g>
    </svg>
  );
}

function PenArrow({ delay }: { delay: number }) {
  const line: Variants = {
    off: { pathLength: 0, opacity: 0 },
    on: { pathLength: 1, opacity: 1, transition: { duration: 0.45, delay, ease: "easeOut" } },
  };
  const head: Variants = {
    off: { pathLength: 0, opacity: 0 },
    on: { pathLength: 1, opacity: 1, transition: { duration: 0.2, delay: delay + 0.35, ease: "easeOut" } },
  };
  return (
    <svg aria-hidden viewBox="0 0 46 26" className="pointer-events-none absolute -left-[56px] top-[2px] hidden h-[26px] w-[44px] overflow-visible lg:block">
      <g fill="none" stroke="#ff4fd8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 4px rgba(255,79,216,.55))" }}>
        <motion.path d="M4 20 C 16 6, 32 6, 42 16" variants={line} />
        <motion.path d="M34 10 L 43 17 L 33 21" variants={head} />
      </g>
    </svg>
  );
}

function StuckNote({ text, r, delay, peel }: { text: string; r: number; delay: number; peel: boolean }) {
  const slap: Variants = {
    off: { opacity: 0, y: -18, scale: 1.08, rotate: -7 },
    on: { opacity: 1, y: 0, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 420, damping: 22, delay, opacity: { duration: 0.12, delay } } },
  };
  const lift: Variants = {
    off: { rotate: 0, y: 0, scale: 1 },
    on: { rotate: 0, y: 0, scale: 1 },
    peel: { rotate: -0.7 * r, y: -3, scale: 1.02 },
  };
  const curl: Variants = {
    off: { opacity: 0.8, y: 0 },
    on: { opacity: 0.8, y: 0 },
    peel: { opacity: 1, y: 3 },
  };
  return (
    // base tilt lives in CSS (smaller on phones); framer only animates the slap and the peel on top of it
    <div
      className="relative z-10 ml-2 mb-[-16px] w-[88%] max-w-[300px] self-start rotate-[calc(var(--r)*0.7deg)] lg:col-start-1 lg:col-end-3 lg:row-start-1 lg:mb-0 lg:ml-0 lg:-mt-3 lg:w-[310px] lg:max-w-none lg:rotate-[calc(var(--r)*1deg)]"
      style={{ "--r": r } as CSSProperties}
    >
      <motion.div data-pt variants={slap} style={{ transformOrigin: "50% 0%" }}>
        <motion.div
          variants={lift}
          whileHover={peel ? "peel" : undefined}
          whileTap={peel ? "peel" : undefined}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="relative"
          style={{ transformOrigin: "30% 0%" }}
        >
          {/* lifted corner: a shadow that peeks out under the bottom right */}
          <motion.span
            aria-hidden
            variants={curl}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="absolute bottom-[6px] right-[10px] h-[18px] w-[46%] rotate-[4deg] shadow-[0_10px_12px_-6px_rgba(28,29,31,.45)]"
          />
          <div
            className="relative rounded-[2px] px-4 py-3.5 shadow-[0_1px_1px_rgba(28,29,31,.06),0_8px_16px_-12px_rgba(28,29,31,.35)] lg:px-5 lg:py-[18px]"
            style={{ backgroundImage: "linear-gradient(180deg,#fff6b5,#ffec85)" }}
          >
            <p className="min-w-0 font-[family-name:var(--font-serif)] text-[16.5px] font-medium italic leading-snug text-[#3d3300] lg:text-[18px]">
              <span className="sr-only">Stuck: </span>
              {text}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function CaseRow({ row, i, reduce, wide }: { row: Row; i: number; reduce: boolean; wide: boolean }) {
  const [ref, shown] = useShown<HTMLLIElement>("0px 0px -15% 0px");
  const base = wide ? i * 0.08 : 0;
  const rot = STAMP_ROT[i % STAMP_ROT.length];

  const card: Variants = {
    off: { opacity: 0, y: 12 },
    on: { opacity: 1, y: 0, transition: { duration: 0.45, delay: base, ease: EASE } },
  };
  const dip: Variants = {
    off: { y: 0 },
    on: { y: [0, 1.5, 0], transition: { duration: 0.18, delay: base + 0.9, ease: "easeOut" } },
  };
  const stamp: Variants = {
    off: { opacity: 0, scale: wide ? 1.9 : 1.5, rotate: -18 },
    on: {
      opacity: 0.88,
      scale: 1,
      rotate: 0,
      transition: { type: "spring", stiffness: 700, damping: 24, mass: 0.6, delay: base + 0.75, opacity: { duration: 0.1, delay: base + 0.75 } },
    },
  };
  const ink: Variants = {
    off: { opacity: 0, scale: 1 },
    // starts from 0 so the ring stays hidden while it waits for the thump
    on: { opacity: [0, 0.35, 0], scale: [1, 1, 1.35], transition: { duration: 0.42, times: [0, 0.05, 1], delay: base + 0.88, ease: "easeOut" } },
  };

  return (
    <motion.li
      ref={ref}
      initial={reduce ? false : "off"}
      animate={reduce || shown ? "on" : "off"}
      className="flex min-w-0 flex-col lg:grid lg:grid-cols-[40px_270px_minmax(0,1fr)]"
    >
      <StuckNote text={row.pain} r={ROT[i % ROT.length]} delay={base + 0.12} peel={!reduce} />

      <motion.div data-pt variants={card} className="min-w-0 lg:col-start-2 lg:col-end-4 lg:row-start-1">
        <motion.div
          variants={dip}
          className={`relative flex min-h-[100px] flex-col justify-center rounded-[12px] border border-[#e3e6eb] bg-white pb-4 pl-4 pr-[72px] pt-[28px] lg:min-h-[110px] lg:py-5 lg:pl-[336px] lg:pr-[112px] ${SHADOW}`}
        >
          <div className="min-w-0">
            <p className="border-b border-[#ffb3ea] pb-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-accent lg:text-[10.5px]">
              Sorted in {row.source}
            </p>
            <p
              className="relative mt-2 min-w-0 text-[15.5px] font-semibold leading-[26px] text-[#1c1d1f] [--rule-gap:25px] [--rule:26px] lg:text-[17px] lg:leading-[28px] lg:[--rule-gap:27px] lg:[--rule:28px]"
              style={RULED}
            >
              <PenArrow delay={base + 0.45} />
              <span className="sr-only">Sorted: </span>
              <Marked text={row.solution} mark={MARKS[i] ?? ""} />
            </p>
          </div>

          <span aria-hidden className="absolute bottom-3 right-3 h-[52px] w-[52px] lg:bottom-auto lg:right-5 lg:top-1/2 lg:h-[84px] lg:w-[84px] lg:-translate-y-1/2">
            {!reduce && <motion.span variants={ink} className="absolute inset-[4%] rounded-full border-2 border-[#5624d0]" />}
            <motion.span data-pt variants={stamp} className="absolute inset-0 block mix-blend-multiply">
              <Stamp source={row.source} rot={rot} />
            </motion.span>
          </span>
        </motion.div>
      </motion.div>
    </motion.li>
  );
}

/** Label-maker tape: two cut pieces whose slanted ends meet, so it reads as one strip but can wrap. */
function DymoTape({ reduce }: { reduce: boolean }) {
  const [ref, shown] = useShown<HTMLDivElement>("0px 0px -10% 0px");
  const tape: Variants = { off: { opacity: 0, x: -12 }, on: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } } };
  const pieces = TAPE.map((piece, p) => [...(p > 0 ? " " : "") + piece + (p === 0 ? " " : "")]);
  const offsets = pieces.map((_, p) => pieces.slice(0, p).reduce((s, c) => s + c.length, 0));
  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : "off"}
      animate={reduce || shown ? "on" : "off"}
      variants={tape}
      data-pt
      className="mx-auto mt-12 flex max-w-full -rotate-[1.5deg] flex-wrap justify-center gap-y-2 drop-shadow-[0_8px_12px_rgba(28,29,31,.22)]"
    >
      <p className="sr-only">{TAPE.join(" ")}</p>
      {TAPE.map((piece, p) => (
        <span
          key={piece}
          aria-hidden
          className={`flex h-[34px] items-center bg-[#1c1d1f] px-4 font-mono text-[11.5px] font-bold uppercase tracking-[0.22em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.12)] sm:text-[13px] ${p > 0 ? "-ml-[5px] pl-3" : "pr-3"}`}
          style={{
            clipPath: "polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)",
            textShadow: "0 -1px 0 rgba(0,0,0,.6), 0 1px 0 rgba(255,255,255,.18)",
          }}
        >
          {pieces[p].map((ch, k) => (
            <motion.span
              key={k}
              data-pt
              className="whitespace-pre"
              variants={{ off: { opacity: 0 }, on: { opacity: 1, transition: { duration: 0.01, delay: 0.3 + (offsets[p] + k) * 0.025 } } }}
            >
              {ch}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.div>
  );
}

function Heading({ reduce }: { reduce: boolean }) {
  const [ref, shown] = useShown<HTMLHeadingElement>("0px 0px -10% 0px");
  return (
    <motion.h2
      ref={ref}
      initial={reduce ? false : "off"}
      animate={reduce || shown ? "on" : "off"}
      className="display text-center text-[clamp(30px,4.4vw,50px)] leading-[1.05]"
    >
      From{" "}
      <motion.span
        variants={{
          off: { rotate: -7, y: -8, opacity: 0 },
          on: { rotate: 0, y: 0, opacity: 1, transition: { type: "spring", stiffness: 420, damping: 20, opacity: { duration: 0.12 } } },
        }}
        data-pt
        className="inline-block -rotate-3 bg-[#fff1a0] px-[0.16em] text-foreground shadow-[0_8px_14px_-10px_rgba(28,29,31,.55)]"
      >
        stuck
      </motion.span>{" "}
      to{" "}
      <span className="accent-text relative inline-block">
        sorted
        <svg aria-hidden viewBox="0 0 200 12" preserveAspectRatio="none" className="pointer-events-none absolute -bottom-[0.14em] left-0 h-[0.28em] w-full overflow-visible">
          <motion.path
            d="M2 8 C 40 2, 90 2, 140 6 S 196 10, 198 4"
            fill="none"
            stroke="#ff4fd8"
            strokeWidth="3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{ filter: "drop-shadow(0 0 4px rgba(255,79,216,.55))" }}
            variants={{
              off: { pathLength: 0, opacity: 0 },
              on: { pathLength: 1, opacity: 1, transition: { duration: 0.7, delay: 0.3, ease: "easeOut" } },
            }}
          />
        </svg>
      </span>
    </motion.h2>
  );
}

export default function PainTactile() {
  const reduce = !!useReducedMotion();
  const wide = useWide();
  const root = useRef<HTMLElement>(null);
  useEffect(() => root.current?.setAttribute("data-pt-live", ""), []);
  return (
    <section ref={root} className="pt-root scroll-mt-6 overflow-x-clip bg-white px-5 py-20 sm:py-24">
      {/* if scripts never run, the reveal states would hide the content: show it anyway after a beat */}
      <style>{FALLBACK_CSS}</style>
      <div className="mx-auto max-w-6xl">
        <Heading reduce={reduce} />
        <p className="mx-auto mt-3 max-w-[520px] text-balance text-center text-[15.5px] text-muted">{SUBLINE}</p>

        <ul className="mx-auto mt-12 grid max-w-[940px] grid-cols-[minmax(0,1fr)] gap-7 lg:flex lg:flex-col lg:gap-8">
          {course.painSolutions.map((row, i) => (
            <CaseRow key={row.pain} row={row} i={i} reduce={reduce} wide={wide} />
          ))}
        </ul>

        <DymoTape reduce={reduce} />
      </div>
    </section>
  );
}
