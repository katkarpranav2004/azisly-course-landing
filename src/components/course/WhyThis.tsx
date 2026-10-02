"use client";

import Image from "next/image";
import { useRef, useSyncExternalStore, type ReactNode } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useStudio } from "./StudioContext";
import { cohort, faculty, MODULE_COUNT } from "@/content/shared";

const EASE = [0.22, 1, 0.36, 1] as const;
const INSTANT = { duration: 0 };
const PINK = "#ff4fd8";
const inr = (n: number) => n.toLocaleString("en-IN");
const serif = "font-[family-name:var(--font-serif)]";

// The four curriculum modules tagged "Build".
const BUILDS = [
  { name: "Your own AI agent", module: 6 },
  { name: "AI dashboard agent", module: 7 },
  { name: "Survey and summarizer agents", module: 8 },
  { name: "Working prototype", module: 9 },
];

// 13 tally strokes in counting order: four uprights, the slash, four more, the slash, three more.
const up = (x: number, top = 4) => `M${x} ${top} L ${x + 1} 27`;
const TALLY = [up(6), up(14, 3), up(22, 5), up(30), "M0 24 L 36 6", up(56, 3), up(64), up(72, 5), up(80, 4), "M50 24 L 86 6", up(106, 5), up(114, 3), up(122)];

const rise = (y: number, duration: number, x = 0): Variants => ({
  hide: { opacity: 0, y, x, transition: INSTANT },
  show: (delay: number = 0) => ({ opacity: 1, y: 0, x: 0, transition: { duration, delay, ease: EASE } }),
});

const draw: Variants = {
  hide: { pathLength: 0, opacity: 0, transition: INSTANT },
  show: ([delay, duration]: [number, number]) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { delay, duration, ease: "easeOut" }, opacity: { delay, duration: 0.01 } },
  }),
};

const pop: Variants = {
  hide: { opacity: 0, scale: 0.7, transition: INSTANT },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 500, damping: 22, delay: 0.3 } },
};

const rule: Variants = {
  hide: { scaleX: 0, transition: INSTANT },
  show: { scaleX: 1, transition: { duration: 0.35, delay: 0.25, ease: EASE } },
};

const noop = () => () => {};
/** False in the server HTML and during hydration, true once the client has taken over. */
const useHydrated = () => useSyncExternalStore(noop, () => true, () => false);

/**
 * Each article plays its own marks once it scrolls into view. The server HTML renders everything
 * fully drawn, so nothing is stuck invisible if scripts are slow; the client resets to "hide"
 * (instantly, while the section is still off screen) and replays on view. Reduced motion stays drawn.
 */
function Article({ as = "article", className, children }: { as?: "article" | "header"; className: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const reduce = useReducedMotion();
  const hydrated = useHydrated();
  const show = reduce || !hydrated || inView;
  const Tag = as === "header" ? motion.header : motion.article;
  return (
    <Tag ref={ref} initial={false} animate={show ? "show" : "hide"} className={className}>
      {children}
    </Tag>
  );
}

function Kicker({ n, children }: { n: string; children: ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
      <span className="text-foreground">{n}</span>&nbsp;&nbsp;{children}
    </p>
  );
}

function Tally() {
  return (
    <svg aria-hidden viewBox="0 0 156 30" className="mt-4 h-[30px] w-[156px] overflow-visible lg:h-[36px] lg:w-[188px]">
      <g fill="none" stroke={PINK} strokeWidth="3" strokeLinecap="round">
        {TALLY.map((d, i) => (
          <motion.path key={i} d={d} variants={draw} custom={[0.5 + i * 0.06, 0.14]} />
        ))}
      </g>
    </svg>
  );
}

function LivePill() {
  return (
    <motion.span
      variants={pop}
      style={{ rotate: -3 }}
      className="inline-flex items-center gap-2 rounded-full bg-[#1c1d1f] px-3 py-1.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-white shadow-[inset_0_-1px_0_rgba(255,255,255,.08)]"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#ff4fd8] opacity-70 motion-safe:animate-ping" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ff4fd8]" />
      </span>
      Live on {cohort.platform}
    </motion.span>
  );
}

function Tick({ i }: { i: number }) {
  return (
    <svg aria-hidden viewBox="0 0 16 14" className="h-[14px] w-4 shrink-0 overflow-visible sm:absolute sm:-left-7 sm:top-1/2 sm:-translate-y-1/2">
      <motion.path d="M2 8 L 6 12 L 14 2" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" variants={draw} custom={[0.35 + i * 0.12, 0.22]} />
    </svg>
  );
}

function LedgerLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`min-w-0 font-mono text-[10.5px] uppercase leading-snug tracking-[0.14em] text-muted ${className}`}>{children}</span>;
}

/** ₹5,999 ÷ 13 worked out as a column sum, ruled off and double underlined like a final figure. */
function Ledger({ offer }: { offer: number }) {
  const perClass = Math.round(offer / MODULE_COUNT);
  const figure = `${serif} text-right text-[24px] font-bold leading-none lg:text-[28px]`;
  return (
    <div className="mt-5 inline-grid grid-cols-[22px_auto_minmax(0,1fr)] items-baseline gap-x-3 gap-y-1.5 tabular-nums">
      <span />
      <motion.span variants={rise(8, 0.35)} custom={0} className={figure}>
        <span className="mr-0.5 text-[0.62em] font-semibold">₹</span>
        {inr(offer)}
      </motion.span>
      <LedgerLabel>one time, GST incl.</LedgerLabel>
      <span className="font-mono text-[22px] leading-none text-[#2d2f31]">÷</span>
      <motion.span variants={rise(8, 0.35)} custom={0.1} className={figure}>
        {MODULE_COUNT}
      </motion.span>
      <LedgerLabel>live classes</LedgerLabel>

      <motion.span variants={rule} className="col-span-2 my-1.5 block h-[1.5px] origin-right bg-foreground" />
      <span />

      <span className="self-end pb-3 font-mono text-[22px] leading-none">≈</span>
      <motion.span
        variants={rise(10, 0.4)}
        custom={0.4}
        className={`${serif} relative text-right text-[clamp(76px,20vw,112px)] font-bold leading-[0.9] tracking-[-0.04em] lg:text-[clamp(84px,8.5vw,116px)]`}
      >
        <span className="relative top-[0.18em] mr-1 align-top text-[0.42em] tracking-normal">₹</span>
        {perClass}
        <svg aria-hidden viewBox="0 0 200 24" preserveAspectRatio="none" className="pointer-events-none absolute left-0 right-0 top-[calc(100%+4px)] h-[18px] w-full overflow-visible">
          <g fill="none" stroke={PINK} strokeWidth="3.5" strokeLinecap="round">
            <motion.path d="M2 6 C 60 2, 140 3, 198 5" variants={draw} custom={[0.8, 0.35]} />
            <motion.path d="M8 17 C 70 13, 130 14, 190 15" variants={draw} custom={[1.0, 0.3]} />
          </g>
        </svg>
      </motion.span>
      <LedgerLabel className="self-end pb-2">per live class</LedgerLabel>
    </div>
  );
}

/** "Why this, not another course" as a by-the-numbers spread: 13 live classes, about ₹461 a class, 4 builds. */
export default function WhyThis() {
  const { copy, content } = useStudio();
  const [live, price, real] = copy.usp;
  const OFFER = content.pricing.offerPrice;
  const { founder } = faculty;

  return (
    <section className="overflow-x-clip px-5 pb-20 pt-4 sm:pb-28 sm:pt-8">
      <div className="mx-auto max-w-6xl">
        <Article as="header" className="min-w-0">
          <motion.p variants={rise(10, 0.45)} className="font-mono text-[11.5px] uppercase tracking-[0.22em] text-muted">
            Three reasons, in numbers
          </motion.p>
          <motion.h2 variants={rise(18, 0.6)} custom={0.06} className="display mt-3 text-[clamp(36px,6vw,76px)] leading-[0.95] tracking-[-0.03em]">
            <span className="block">Why this,</span>
            <span className="block text-accent">not another course</span>
          </motion.h2>
        </Article>

        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] border-t-2 border-foreground lg:mt-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          {/* 01: the lead. Sticky on desktop so the 13 holds while 02 and 03 scroll past. */}
          <Article className="min-w-0 pb-10 pt-8 lg:sticky lg:top-24 lg:self-start lg:pb-0 lg:pr-12">
            <Kicker n="01">Live</Kicker>
            <div className="mt-4 flex flex-wrap items-end gap-x-5 gap-y-2">
              <motion.span
                variants={rise(24, 0.6)}
                className="display -ml-[0.05em] block text-[clamp(132px,36vw,240px)] leading-[0.78] tracking-[-0.05em] tabular-nums lg:text-[clamp(170px,17vw,240px)]"
              >
                {MODULE_COUNT}
              </motion.span>
              <span className="flex flex-col items-start pb-3">
                <LivePill />
                <span className={`${serif} mt-2.5 text-[20px] font-semibold leading-tight lg:text-[24px]`}>live classes</span>
              </span>
            </div>
            <Tally />
            <h3 className="display mt-6 text-[24px] leading-tight lg:text-[30px]">{live.title}</h3>
            <p className="mt-2.5 max-w-[44ch] text-[15.5px] leading-relaxed text-[#2d2f31]">{live.text}</p>
            <div className="mt-6 flex items-center gap-3">
              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-[#ff4fd8] ring-offset-2">
                <Image src={founder.photo} alt="" fill sizes="48px" className="object-cover object-[50%_18%]" />
              </span>
              <p className="min-w-0 leading-snug">
                <span className="block text-[14px] font-bold">{founder.name}</span>
                <span className="block text-[12.5px] text-muted">IIT Kharagpur · Ex-President, OYO International</span>
              </p>
            </div>
          </Article>

          <div className="min-w-0 border-t border-border lg:border-l lg:border-t-0 lg:pl-12">
            {/* 02: the price, worked out. */}
            <Article className="min-w-0 border-b border-border pb-10 pt-8">
              <Kicker n="02">Price</Kicker>
              <Ledger offer={OFFER} />
              <h3 className="display mt-10 text-[22px] leading-tight lg:text-[26px]">{price.title}</h3>
              <p className="mt-2 max-w-[48ch] text-[15px] leading-relaxed text-muted">{price.text}</p>
            </Article>

            {/* 03: the builds, as a report's contents page. */}
            <Article className="min-w-0 pb-2 pt-8">
              <Kicker n="03">Real work</Kicker>
              <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start sm:gap-10">
                <div className="flex items-end gap-3 sm:flex-col sm:items-start sm:gap-2">
                  <motion.span
                    variants={rise(16, 0.5)}
                    className="display -ml-[0.03em] block text-[clamp(76px,20vw,112px)] leading-[0.85] tracking-[-0.04em] tabular-nums"
                  >
                    {BUILDS.length}
                  </motion.span>
                  <span className={`${serif} max-w-[12ch] pb-1.5 text-[17px] font-semibold leading-tight sm:pb-0`}>real builds you can show</span>
                </div>
                <div className="min-w-0 sm:pt-2">
                  <p className="border-b border-foreground pb-1.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted">Your portfolio</p>
                  <ul>
                    {BUILDS.map((b, i) => (
                      <motion.li
                        key={b.name}
                        variants={rise(0, 0.3, -6)}
                        custom={i * 0.08}
                        className="relative flex items-baseline gap-2 border-b border-border py-2.5"
                      >
                        <Tick i={i} />
                        <span className="min-w-0 text-[15px] font-medium leading-snug">{b.name}</span>
                        <span aria-hidden className="min-w-4 flex-1 -translate-y-1 border-b-2 border-dotted border-[#c3c8cd]" />
                        <span className="shrink-0 font-mono text-[12px] tabular-nums text-muted">M{String(b.module).padStart(2, "0")}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
              <h3 className="display mt-8 text-[22px] leading-tight lg:text-[26px]">{real.title}</h3>
              <p className="mt-2 max-w-[48ch] text-[15px] leading-relaxed text-muted">{real.text}</p>
            </Article>
          </div>
        </div>

        <p className="mt-10 border-t border-border pt-3 font-mono text-[10.5px] uppercase leading-relaxed tracking-[0.14em] text-muted">
          Workings: ₹{inr(OFFER)} ÷ {MODULE_COUNT} classes = ₹{(OFFER / MODULE_COUNT).toFixed(2)} a class · Builds are modules{" "}
          {BUILDS[0].module} to {BUILDS[BUILDS.length - 1].module}
        </p>
      </div>
    </section>
  );
}
