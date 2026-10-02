"use client";

import Image from "next/image";
import { motion, useAnimationControls, useReducedMotion, type Variants } from "framer-motion";
import { useSyncExternalStore, type ReactNode } from "react";
import Reveal from "@/components/Reveal";
import { course, courseContent } from "@/content/course";
import { BUILD_COUNT, cohort, faculty, MODULE_COUNT } from "@/content/shared";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const pad = (n: number) => String(n).padStart(2, "0");

const PRICE = courseContent.pricing.offerPrice;
const PER_CLASS = Math.round(PRICE / MODULE_COUNT);

const VIEW = { once: true, margin: "0px 0px -15% 0px" } as const;
const OBJECT = "border border-[#e3e6eb] shadow-[0_10px_24px_-16px_rgba(28,29,31,.5)]";
const PINK_GLOW = { filter: "drop-shadow(0 0 3px rgba(255,79,216,.6))" };

// Receipt lines, shortened from course.includes so each fits one 37-character row.
const RECEIPT_LINES = [
  `${MODULE_COUNT} live classes`,
  `${BUILD_COUNT} real builds`,
  "RTCO framework",
  "1:1 doubt support",
  "Certificate",
  "Lifetime access",
  "GST",
];

// The four builds from course.leverage, as divider tabs.
const TABS = [
  { label: "Agent", bg: "#5624d0", ink: "#ffffff" },
  { label: "Dashboard", bg: "#6fd8b9", ink: "#0f3d33" },
  { label: "Survey", bg: "#e9e2ff", ink: "#3b198f" },
  { label: "Prototype", bg: "#fff1a0", ink: "#5b4a00" },
];

// Deterministic barcode: [bar width, gap] in px.
const BARS = [
  [2, 1], [1, 1], [3, 2], [1, 1], [1, 2], [2, 1], [3, 1], [1, 2], [2, 1], [1, 1], [1, 3], [2, 1],
  [3, 1], [1, 1], [2, 2], [1, 1], [3, 1], [1, 2], [1, 1], [2, 1], [1, 2], [3, 1], [2, 1], [1, 1],
  [1, 2], [2, 1], [3, 2], [1, 1], [2, 1], [1, 1], [3, 1], [1, 2], [2, 1], [1, 0],
];

const SCREWS = [
  { pos: "left-2 top-2", rot: 20 },
  { pos: "right-2 top-2", rot: -35 },
  { pos: "bottom-2 left-2", rot: 75 },
  { pos: "bottom-2 right-2", rot: -10 },
];

const KNOB_TRAVEL = 140;
// Half-moon thumb cut in the folder's front panel, so the sheet behind peeks through.
const THUMB_CUT = "radial-gradient(28px 12px at 50% 0, #0000 95%, #000 100%)";

const steps = (t: number) => Math.ceil(t * 16) / 16;
const noopSubscribe = () => () => {};

/* ---------------------------------------------------------------- shared bits */

function Perforation({ className = "relative" }: { className?: string }) {
  return (
    <div aria-hidden className={`h-0 border-t-2 border-dashed border-[#e3e6eb] ${className}`}>
      <span className="absolute -left-[7px] -top-[7px] h-3 w-3 rounded-full border border-[#e3e6eb] bg-white" />
      <span className="absolute -right-[7px] -top-[7px] h-3 w-3 rounded-full border border-[#e3e6eb] bg-white" />
    </div>
  );
}

function Claim({ title, text, className = "" }: { title: string; text: string; className?: string }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <h3 className="font-[family-name:var(--font-serif)] text-[23px] font-bold leading-[1.1] tracking-[-0.01em] text-foreground sm:text-[26px]">
        {title}
      </h3>
      <p className="mt-2 max-w-[34ch] text-[15px] leading-relaxed text-muted">{text}</p>
    </div>
  );
}

const MonoLabel = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <span className={`font-mono text-[10px] uppercase tracking-[0.2em] text-muted ${className}`}>{children}</span>
);

/* ---------------------------------------------------------------- 1. live plate */

const plateV: Variants = {
  rest: { opacity: 0, y: 14 },
  on: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};
const knobV: Variants = {
  rest: { x: -KNOB_TRAVEL },
  on: { x: 0, transition: { delay: 0.45, type: "spring", stiffness: 520, damping: 32 } },
};
const strikeV: Variants = {
  rest: { pathLength: 0, opacity: 0 },
  on: { pathLength: 1, opacity: 1, transition: { delay: 0.6, duration: 0.35, ease: "easeOut" } },
};
const lampV: Variants = {
  rest: { opacity: 0.25 },
  on: { opacity: 1, transition: { delay: 0.7, duration: 0.15 } },
};
const ledV: Variants = {
  rest: { opacity: 0, scale: 0.6 },
  on: (i: number) => ({ opacity: 1, scale: 1, transition: { delay: 0.8 + i * 0.045, duration: 0.2, ease: "easeOut" } }),
};

function LivePlate({ reduce }: { reduce: boolean }) {
  const nudge = useAnimationControls();
  const blink = useAnimationControls();
  const { founder } = faculty;

  return (
    <motion.div
      variants={plateV}
      initial={reduce ? false : "rest"}
      {...(reduce ? { animate: "on" } : { whileInView: "on", viewport: VIEW })}
      onTap={reduce ? undefined : () => nudge.start({ x: [0, -14, 0], transition: { duration: 0.42, ease: "easeInOut" } })}
      className={`relative w-[300px] max-w-full select-none rounded-[18px] bg-[linear-gradient(#ffffff,#f4f5f7)] px-6 pb-4 pt-[18px] ${OBJECT}`}
    >
      {SCREWS.map((s) => (
        <span
          key={s.pos}
          aria-hidden
          style={{ rotate: `${s.rot}deg` }}
          className={`absolute ${s.pos} flex h-[7px] w-[7px] items-center justify-center rounded-full bg-[#e3e6eb] shadow-[inset_0_-1px_0_rgba(28,29,31,.12)]`}
        >
          <span className="h-px w-[5px] bg-[#c9ced4]" />
        </span>
      ))}

      <div className="flex items-center gap-2.5">
        <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-2 ring-[#ff4fd8]">
          <Image src={founder.photo} alt="" fill sizes="32px" className="object-cover object-[50%_18%]" />
        </span>
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">On air</span>
        <MonoLabel className="ml-auto">{cohort.platform}</MonoLabel>
        <span aria-hidden className="relative h-[9px] w-[9px] shrink-0">
          <span className="absolute inset-0 rounded-full bg-[#f6d3ef]" />
          <motion.span variants={lampV} className="absolute inset-0">
            <motion.span animate={blink} className="absolute inset-0">
            <motion.span
              className="absolute inset-0 rounded-full bg-[#ff4fd8] shadow-[0_0_8px_rgba(255,79,216,.75)]"
              animate={reduce ? undefined : { opacity: [1, 0.55, 1] }}
              transition={{ delay: 1, duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
            </motion.span>
          </motion.span>
        </span>
      </div>

      {/* slide switch: "Recorded" is engraved under the knob's travel, LIVE rides on the knob */}
      <div className="relative mt-3 h-14 w-full rounded-full bg-[#eceef1] shadow-[inset_0_2px_6px_rgba(28,29,31,.18)]">
        <span className="absolute inset-y-0 left-1 flex w-[140px] items-center justify-center text-[13px] font-semibold text-[#9aa0a6] [text-shadow:0_1px_0_#fff]">
          <span className="relative">
            Recorded
            <svg aria-hidden viewBox="0 0 80 20" preserveAspectRatio="none" className="pointer-events-none absolute -inset-x-2 top-1/2 h-4 w-[calc(100%+16px)] -translate-y-1/2 overflow-visible">
              <motion.path
                d="M3 13 C 22 9, 44 12, 62 7 S 74 6, 78 5"
                variants={strikeV}
                fill="none"
                stroke="#ff4fd8"
                strokeWidth="2.75"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={PINK_GLOW}
              />
            </svg>
          </span>
        </span>
        <motion.div
          variants={knobV}
          drag={reduce ? false : "x"}
          dragConstraints={{ left: -KNOB_TRAVEL, right: 0 }}
          dragElastic={0.12}
          dragSnapToOrigin
          onDragEnd={() => blink.start({ opacity: [1, 0.15, 1, 0.15, 1], transition: { duration: 0.6, delay: 0.2 } })}
          style={{ touchAction: "pan-y" }}
          className="absolute right-1 top-1 cursor-grab active:cursor-grabbing"
        >
          <motion.div
            animate={nudge}
            className="flex h-12 w-[104px] items-center gap-2 rounded-full border border-[#d1d7dc] bg-[linear-gradient(#ffffff,#eef0f3)] pl-3.5 pr-4 shadow-[0_4px_10px_-3px_rgba(28,29,31,.35)]"
          >
            <span aria-hidden className="flex gap-[3px]">
              {[0, 1, 2].map((r) => (
                <span key={r} className="h-4 w-px bg-[#cfd3d8]" />
              ))}
            </span>
            <span className="ml-auto flex items-center gap-1.5">
              <span aria-hidden className="h-2 w-2 rounded-full bg-[#ff4fd8] shadow-[0_0_8px_rgba(255,79,216,.7)]" />
              <span className="font-mono text-[12px] font-bold tracking-[0.08em] text-foreground">LIVE</span>
            </span>
          </motion.div>
        </motion.div>
      </div>

      <div aria-hidden className="mt-3.5 flex justify-between">
        {Array.from({ length: MODULE_COUNT }, (_, i) => (
          <span key={i} className="relative h-[7px] w-[7px] rounded-full bg-[#e3e6eb]">
            <motion.span custom={i} variants={ledV} className="absolute inset-0 rounded-full bg-[#ff4fd8] shadow-[0_0_6px_rgba(255,79,216,.6)]" />
          </span>
        ))}
      </div>
      <div className="mt-1.5 flex justify-between">
        <MonoLabel>Classes 01 to {pad(MODULE_COUNT)}</MonoLabel>
        <MonoLabel>All live</MonoLabel>
      </div>
    </motion.div>
  );
}

/* ---------------------------------------------------------------- 2. receipt */

const paperV: Variants = {
  rest: { y: "-100%" },
  on: { y: 0, transition: { duration: 1.5, ease: steps } },
};
const loopV: Variants = {
  rest: { pathLength: 0, opacity: 0 },
  on: { pathLength: 1, opacity: 1, transition: { delay: 1.75, duration: 0.6, ease: "easeOut" } },
};

const Rule = () => <li aria-hidden className="my-2.5 border-t border-dashed border-[#c9ccd1]" />;

function Line({ label, value, className = "" }: { label: string; value: ReactNode; className?: string }) {
  return (
    <li className={`flex items-baseline gap-1.5 ${className}`}>
      <span className="shrink-0">{label}</span>
      <span aria-hidden className="min-w-3 flex-1 -translate-y-[3px] border-b border-dotted border-[#c9ccd1]" />
      <span className="shrink-0">{value}</span>
    </li>
  );
}

function Receipt({ reduce }: { reduce: boolean }) {
  return (
    <div className="mx-auto w-full max-w-[324px] lg:mx-0">
      <div aria-hidden className="relative z-10 h-[14px] w-full rounded-full bg-[#1c1d1f] shadow-[inset_0_-2px_0_rgba(255,255,255,.08),0_6px_10px_-6px_rgba(28,29,31,.5)]" />
      {/* whileInView lives on the clipping wrapper: the paper starts outside it, so it never intersects on its own */}
      <motion.div
        initial={reduce ? false : "rest"}
        {...(reduce ? { animate: "on" } : { whileInView: "on", viewport: VIEW })}
        className="relative -mt-[7px] mx-auto w-[300px] max-w-[calc(100%-24px)] overflow-hidden"
        style={{ filter: "drop-shadow(0 6px 8px rgba(28,29,31,.14))" }}
      >
        <motion.div
          variants={paperV}
          style={{
            WebkitMask: "conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) 50% / 12px 100%",
            mask: "conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) 50% / 12px 100%",
          }}
          className="bg-[#fbfaf5] px-5 pb-9 pt-6 font-mono text-[11px] uppercase leading-[1.8] tracking-[0.06em] text-[#2d2f31] sm:text-[11.5px] sm:leading-[1.85]"
        >
          <ul aria-label="Price breakdown">
            <li className="text-center text-[13px] font-bold tracking-[0.3em] text-foreground">Azisly.ai</li>
            <li className="text-center">AI Corporate Analyst</li>
            <li className="text-center text-[#6b6f74]">One time · Live on {cohort.platform}</li>
            <Rule />
            {RECEIPT_LINES.map((l) => (
              <Line key={l} label={l} value="Incl." />
            ))}
            <Rule />
            <li className="flex items-baseline justify-between gap-3 pt-0.5">
              <span className="font-bold">Total</span>
              <span className="font-[family-name:var(--font-serif)] text-[28px] font-bold normal-case leading-none tracking-[-0.02em] text-foreground">
                {inr(PRICE)}
              </span>
            </li>
            <Line
              className="mt-2.5"
              label="Per live class"
              value={
                <span className="relative inline-block px-1 text-[15px] font-bold text-foreground">
                  {inr(PER_CLASS)}
                  <svg aria-hidden viewBox="0 0 80 40" preserveAspectRatio="none" className="pointer-events-none absolute -left-3 -right-3 -top-[9px] h-[calc(100%+16px)] w-[calc(100%+24px)] overflow-visible">
                    <motion.path
                      d="M60 6 C 44 0, 12 2, 5 15 C -1 28, 22 37, 44 35 C 66 33, 80 25, 75 13 C 72 6, 60 2, 44 4"
                      variants={loopV}
                      fill="none"
                      stroke="#ff4fd8"
                      strokeWidth="2.75"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      style={PINK_GLOW}
                    />
                  </svg>
                </span>
              }
            />
            <Line className="mt-1" label="Hidden charges" value="₹0" />
            <Rule />
            <li aria-hidden className="flex h-7 justify-center pt-1">
              {BARS.map(([w, g], i) => (
                <span key={i} className="h-full bg-[#1c1d1f]" style={{ width: w, marginRight: g }} />
              ))}
            </li>
            <li className="mt-2 text-center text-[#6b6f74]">Class 1 · {cohort.startsLabel} · See you there</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ---------------------------------------------------------------- 3. folder */

const sheetV: Variants = {
  rest: { y: 34 },
  on: (i: number) => ({ y: 0, transition: { delay: 0.25 + i * 0.09, type: "spring", stiffness: 380, damping: 24 } }),
};
const stampV: Variants = {
  rest: { scale: 1.7, opacity: 0, rotate: -20 },
  on: { scale: 1, opacity: 0.88, rotate: -8, transition: { delay: 0.85, type: "spring", stiffness: 700, damping: 24 } },
};

function Folder({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      initial={reduce ? false : "rest"}
      {...(reduce ? { animate: "on" } : { whileInView: "on", viewport: VIEW })}
      className="relative h-[214px] w-[300px] max-w-full select-none"
    >
      {/* back panel */}
      <div aria-hidden className={`absolute inset-x-0 bottom-0 top-[40px] rounded-[12px] bg-[#e8cf98] ${OBJECT} border-[#dcc187]`} />

      {/* divider sheets, each 7px lower than the one behind it */}
      <ul aria-label={`${BUILD_COUNT} real builds`} className="absolute inset-0">
        {TABS.map((t, i) => (
          <motion.li
            key={t.label}
            custom={i}
            variants={sheetV}
            whileHover={reduce ? undefined : { y: -8 }}
            whileTap={reduce ? undefined : { y: -8 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
            className="absolute bottom-[46px] left-2 right-2"
            style={{ top: 6 + i * 7 }}
          >
            <span
              className="absolute top-0 flex h-[22px] w-[23%] items-center justify-center rounded-t-[6px] font-mono text-[9.5px] font-bold uppercase tracking-[0.06em]"
              style={{ left: `${i * 25.6}%`, background: t.bg, color: t.ink }}
            >
              {t.label}
            </span>
            <span aria-hidden className="absolute inset-x-0 bottom-0 top-[22px] rounded-[4px] border border-[#e3e6eb] bg-white px-3 pt-2.5">
              <span className="block h-[3px] w-[46%] rounded-full bg-[#eceef1]" />
              <span className="mt-1.5 block h-[3px] w-[68%] rounded-full bg-[#eceef1]" />
              <span className="mt-1.5 block h-[3px] w-[38%] rounded-full bg-[#eceef1]" />
            </span>
          </motion.li>
        ))}
      </ul>

      {/* front panel over the lower 56% */}
      <div style={{ WebkitMask: THUMB_CUT, mask: THUMB_CUT }} className="absolute inset-x-0 bottom-0 top-[44%] rounded-[12px] border border-[#dcc187] bg-[#f2dcab] shadow-[inset_0_1px_0_rgba(255,255,255,.55),0_-8px_14px_-10px_rgba(28,29,31,.35)]">
        <span className="absolute left-4 top-4 -rotate-[1.5deg] border border-[#e3e6eb] bg-white px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-foreground shadow-[0_1px_2px_rgba(28,29,31,.12)]">
          Real corporate work
        </span>
        <motion.span
          variants={stampV}
          className="absolute bottom-4 right-4 rounded-[6px] border-[2.5px] border-accent px-2 py-1 text-center font-mono text-[11px] font-bold uppercase leading-[1.35] tracking-[0.2em] text-accent mix-blend-multiply"
        >
          Yours to show
          <br />
          {BUILD_COUNT} real builds
        </motion.span>
      </div>

      {/* paperclip over the front panel's top edge */}
      <svg aria-hidden viewBox="0 0 14 40" className="pointer-events-none absolute right-[18%] top-[calc(44%-22px)] h-10 w-[14px] overflow-visible">
        <path d="M4 34 V 7 a 3.5 3.5 0 0 1 7 0 V 30 a 5 5 0 0 1 -10 0 V 12" fill="none" stroke="#9aa0a6" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
}

/* ---------------------------------------------------------------- section */

export default function WhyTactile() {
  // Read the motion preference only after hydration, so server and first client render match;
  // the objects are keyed on it, so a reduced-motion visitor gets a fresh mount in the final state.
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const reduce = (useReducedMotion() ?? false) && hydrated;
  const [live, price, useCases] = course.usp;

  return (
    <section className="overflow-x-clip px-5 pb-20 pt-14 sm:pb-24 sm:pt-16">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="display text-center text-[clamp(28px,4vw,44px)] leading-[1.05]">
            Why this, <span className="accent-text">not another course</span>
          </h2>
        </Reveal>

        <div className="mt-4 grid grid-cols-[minmax(0,1fr)] sm:mt-8 lg:mt-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:grid-rows-[1fr_1fr] lg:gap-x-16">
          <div className="flex flex-col gap-6 py-9 sm:flex-row sm:items-center sm:gap-8 lg:col-start-1 lg:row-start-1 lg:self-start lg:pb-10 lg:pt-0">
            <Claim title={live.title} text={live.text} className="order-1 sm:order-2" />
            <div className="order-2 flex shrink-0 justify-center sm:order-1 sm:w-[300px]">
              <LivePlate key={String(reduce)} reduce={reduce} />
            </div>
          </div>

          <Perforation className="relative lg:hidden" />

          <div className="flex flex-col gap-6 py-9 sm:flex-row sm:items-center sm:gap-8 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:flex-col lg:items-stretch lg:gap-7 lg:py-0">
            <Claim title={price.title} text={price.text} className="order-1 sm:order-2 lg:order-1" />
            <div className="order-2 shrink-0 sm:order-1 sm:w-[324px] lg:order-2 lg:w-auto">
              <Receipt key={String(reduce)} reduce={reduce} />
            </div>
          </div>

          <Perforation className="relative lg:hidden" />

          <div className="flex flex-col gap-6 pb-0 pt-9 sm:flex-row sm:items-center sm:gap-8 lg:col-start-1 lg:row-start-2 lg:self-end lg:pt-10">
            <Claim title={useCases.title} text={useCases.text} className="order-1 sm:order-2" />
            <div className="order-2 flex shrink-0 justify-center sm:order-1 sm:w-[300px]">
              <Folder key={String(reduce)} reduce={reduce} />
            </div>
          </div>

          <Perforation className="relative hidden lg:col-start-1 lg:row-start-2 lg:block lg:self-start" />
        </div>
      </div>
    </section>
  );
}
