"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useStudio } from "./StudioContext";

const PINK = "#ff4fd8";
const GLOW = { filter: "drop-shadow(0 0 6px rgba(255,79,216,.7))" };
const EASE = [0.22, 1, 0.36, 1] as const;

type Rect = { x: number; y: number; w: number; h: number };

/**
 * Pen marks: draw in with pathLength, the same way the hero whoosh does. The ink fades with
 * strokeOpacity (not opacity) so the whole mark stays on one JS-driven timeline.
 */
const pen = (delay: number, duration: number, opacity = 1, ease: "easeOut" | "easeInOut" = "easeOut"): Variants => ({
  hidden: { pathLength: 0, strokeOpacity: 0 },
  shown: { pathLength: 1, strokeOpacity: opacity, transition: { pathLength: { delay, duration, ease }, strokeOpacity: { delay, duration: 0.08 } } },
});

/** Text arrives with a short rise, but only if it was offscreen at mount; otherwise it is simply there. */
const rise: Variants = {
  hidden: { opacity: 0, y: 14, transition: { duration: 0 } },
  shown: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

/**
 * `on` drives the pen marks. `text` is "hidden" only for blocks that started below the fold,
 * so server HTML, no-JS and already-visible content are never stuck at opacity 0.
 */
function useEntrance<T extends Element>(margin: `${number}% 0px` | `${number}px` = "-12% 0px") {
  const ref = useRef<T>(null);
  const reduce = !!useReducedMotion();
  const inView = useInView(ref, { once: true, margin });
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (reduce) return;
    const id = requestAnimationFrame(() => {
      const el = ref.current;
      if (el && el.getBoundingClientRect().top > window.innerHeight * 0.92) setArmed(true);
    });
    return () => cancelAnimationFrame(id);
  }, [reduce]);
  const on = reduce || inView;
  return { ref, reduce, on, text: on || !armed ? "shown" : "hidden" };
}

/** One rect per rendered line of an inline span, relative to its parent block. */
function useLineRects(ref: RefObject<HTMLSpanElement | null>) {
  const [rects, setRects] = useState<Rect[]>([]);
  useLayoutEffect(() => {
    const span = ref.current;
    const box = span?.parentElement;
    if (!span || !box) return;
    let alive = true;
    const measure = () => {
      if (!alive) return;
      const base = box.getBoundingClientRect();
      const next = Array.from(span.getClientRects())
        .filter((r) => r.width > 2)
        .map((r) => ({ x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height }));
      setRects((prev) =>
        prev.length === next.length && prev.every((p, i) => Math.abs(p.x - next[i].x) + Math.abs(p.y - next[i].y) + Math.abs(p.w - next[i].w) < 1)
          ? prev
          : next
      );
    };
    // ResizeObserver fires once on observe, which doubles as the first measurement.
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    document.fonts?.ready.then(measure);
    return () => {
      alive = false;
      ro.disconnect();
    };
  }, [ref]);
  return rects;
}

function StruckWord({ children, on, reduce }: { children: ReactNode; on: boolean; reduce: boolean }) {
  return (
    <span className="relative inline-block text-[#5e6266]">
      {children}
      <svg aria-hidden viewBox="0 0 260 40" className="pointer-events-none absolute left-[-0.06em] top-[0.4em] h-auto w-[calc(100%+0.12em)] overflow-visible">
        <g fill="none" stroke={PINK} strokeWidth="6" strokeLinecap="round" style={GLOW}>
          <motion.path d="M4 26 C 60 16, 130 18, 256 12" variants={pen(0.35, 0.35)} initial={reduce ? false : "hidden"} animate={on ? "shown" : "hidden"} />
          <motion.path d="M20 34 C 90 26, 150 27, 240 22" variants={pen(0.6, 0.3)} initial={reduce ? false : "hidden"} animate={on ? "shown" : "hidden"} />
        </g>
      </svg>
    </span>
  );
}

function CircledWord({ children, on, reduce }: { children: ReactNode; on: boolean; reduce: boolean }) {
  return (
    <span className="relative inline-block text-accent">
      {children}
      <svg aria-hidden viewBox="0 0 320 110" className="pointer-events-none absolute left-[-0.2em] top-[-0.14em] h-auto w-[calc(100%+0.4em)] overflow-visible">
        <motion.path
          d="M286 30 C 250 6, 120 4, 52 16 C 10 24, 2 60, 30 84 C 70 108, 220 108, 286 86 C 318 74, 314 40, 262 22"
          fill="none"
          stroke={PINK}
          strokeWidth="5"
          strokeLinecap="round"
          style={GLOW}
          variants={pen(0.85, 0.75, 1, "easeInOut")}
          initial={reduce ? false : "hidden"}
          animate={on ? "shown" : "hidden"}
        />
      </svg>
    </span>
  );
}

/** Splits a solution around its one highlighted keyword. */
function Marked({ text, mark }: { text: string; mark: string }) {
  const at = text.indexOf(mark);
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span className="box-decoration-clone bg-[linear-gradient(transparent_60%,rgba(111,216,185,.5)_60%,rgba(111,216,185,.5)_90%,transparent_90%)] px-[0.06em] [-webkit-box-decoration-break:clone]">
        {mark}
      </span>
      {text.slice(at + mark.length)}
    </>
  );
}

function Row({ i, pain, solution, source, mark, note }: { i: number; pain: string; solution: string; source: string; mark: string; note: string }) {
  const { ref, reduce, on, text } = useEntrance<HTMLLIElement>();
  const painRef = useRef<HTMLSpanElement>(null);
  const lines = useLineRects(painRef);
  const lead = i === 0;
  const extra = Math.max(0, lines.length - 1) * 0.25;
  const init = reduce ? false : ("hidden" as const);
  const state = on ? "shown" : "hidden";

  return (
    <li ref={ref} className="group border-b border-border">
      <motion.div
        variants={rise}
        initial={false}
        animate={text}
        className="grid grid-cols-[34px_minmax(0,1fr)] gap-x-3.5 py-6 md:grid-cols-[64px_minmax(0,1fr)] md:gap-x-6 md:py-8 lg:grid-cols-[88px_minmax(0,1fr)_230px] lg:gap-x-12 lg:py-10"
      >
        {/* Numeral: an outline that inks in once the row is sorted. The <ol> numbers it for screen readers. */}
        <span
          aria-hidden
          className="relative block font-[family-name:var(--font-serif)] text-[30px] font-bold leading-[0.85] tracking-[-0.03em] tabular-nums md:text-[48px] lg:text-[60px]"
        >
          <span className="text-transparent [-webkit-text-stroke:1px_#1c1d1f] lg:[-webkit-text-stroke-width:1.25px]">{String(i + 1).padStart(2, "0")}</span>
          <motion.span
            className="absolute inset-0"
            variants={{ hidden: { color: "rgba(28,29,31,0)" }, shown: { color: "rgba(28,29,31,1)", transition: { delay: 0.9 + extra, duration: 0.3 } } }}
            initial={init}
            animate={state}
          >
            {String(i + 1).padStart(2, "0")}
          </motion.span>
        </span>

        <div className="min-w-0">
          <p className={`relative font-sans text-[15.5px] leading-[1.45] text-[#4b5055] md:text-[17px] ${lead ? "lg:text-[21px]" : "lg:text-[19px]"}`}>
            <span className="sr-only">Before: </span>
            <span ref={painRef}>{pain}</span>
            <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
              {lines.map((r, k) => (
                <motion.path
                  key={`${k}-${Math.round(r.y)}-${Math.round(r.w)}`}
                  d={`M ${r.x - 3} ${r.y + r.h * 0.58} Q ${r.x + r.w / 2} ${r.y + r.h * 0.48} ${r.x + r.w + 3} ${r.y + r.h * 0.55}`}
                  fill="none"
                  stroke={PINK}
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  variants={pen(0.3 + k * 0.25, 0.3, 0.9)}
                  initial={init}
                  animate={state}
                />
              ))}
            </svg>
          </p>

          <div className="relative mt-2.5 md:mt-3">
            <span aria-hidden className="absolute -left-[30px] top-[-6px] w-[28px] md:top-[-18px] transition-transform duration-300 md:-left-[40px] lg:-left-[44px] lg:group-hover:translate-x-[3px]">
              <svg viewBox="0 0 28 36" className="block h-auto w-full overflow-visible">
                <g fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <motion.path d="M6 2 C 4 14, 8 24, 22 27" variants={pen(0.55 + extra, 0.35, 1, "easeInOut")} initial={init} animate={state} />
                  <motion.path d="M15 21 L 23 27 L 15 32" variants={pen(0.85 + extra, 0.15)} initial={init} animate={state} />
                </g>
              </svg>
            </span>
            <p
              className={`font-[family-name:var(--font-serif)] font-bold text-foreground ${
                lead
                  ? "text-[23px] leading-[1.06] tracking-[-0.02em] md:text-[32px] lg:text-[44px]"
                  : "text-[20px] leading-[1.12] tracking-[-0.015em] md:text-[26px] lg:text-[30px]"
              }`}
            >
              <span className="sr-only">After: </span>
              <Marked text={solution} mark={mark} />
            </p>
          </div>

          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted lg:hidden">
            Fixed in · <span className="text-foreground">{source}</span>
          </p>
        </div>

        <aside className="hidden border-l border-border pl-5 pt-1 lg:block">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted">Fixed in</p>
          <p className="mt-1 font-[family-name:var(--font-serif)] text-[18px] font-bold leading-tight text-foreground">{source}</p>
          <p className="mt-1.5 text-[13px] leading-snug text-muted">{note}</p>
        </aside>
      </motion.div>
    </li>
  );
}

/** Rubber stamp that closes the list. Slight ink wear via a turbulence knockout. */
function Stamp() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  const on = reduce || inView;
  return (
    <motion.div
      ref={ref}
      role="img"
      aria-label="Sorted, in 13 live classes on Zoom"
      initial={reduce ? false : { scale: 1.6, rotate: -18 }}
      animate={on ? { scale: 1, rotate: -9 } : { scale: 1.6, rotate: -18 }}
      transition={{ type: "spring", stiffness: 520, damping: 20, delay: 0.15 }}
      className="w-[108px] text-[#1e6055] mix-blend-multiply lg:w-[144px]"
    >
      <svg viewBox="0 0 140 140" className="block h-auto w-full overflow-visible">
        <defs>
          <filter id="pain-c-stamp-wear" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="noise" />
            <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -8 5.7" result="specks" />
            <feComposite in="SourceGraphic" in2="specks" operator="in" />
          </filter>
          <path id="pain-c-stamp-ring" d="M70 21 a49 49 0 1 1 -0.01 0" />
        </defs>
        {/* Ink is faded in via fill/stroke opacity so it rides the same JS timeline as the spring. */}
        <motion.g
          filter="url(#pain-c-stamp-wear)"
          fill="currentColor"
          stroke="currentColor"
          initial={reduce ? false : { fillOpacity: 0, strokeOpacity: 0 }}
          animate={on ? { fillOpacity: 0.9, strokeOpacity: 0.9 } : { fillOpacity: 0, strokeOpacity: 0 }}
          transition={{ duration: 0.12, delay: 0.15 }}
        >
          <circle cx="70" cy="70" r="66" fill="none" strokeWidth="2.5" />
          <circle cx="70" cy="70" r="60" fill="none" strokeWidth="0.9" />
          <circle cx="70" cy="70" r="44.5" fill="none" strokeWidth="0.9" />
          <text className="font-mono" fontSize="10.5" fontWeight="600" letterSpacing="2" stroke="none" textLength="300" lengthAdjust="spacing">
            <textPath href="#pain-c-stamp-ring">IN 13 LIVE CLASSES • ON ZOOM •</textPath>
          </text>
          <line x1="33" y1="58" x2="107" y2="58" strokeWidth="1.4" />
          <line x1="33" y1="84" x2="107" y2="84" strokeWidth="1.4" />
          <text
            x="70"
            y="79"
            textAnchor="middle"
            stroke="none"
            fontSize="22"
            fontWeight="700"
            textLength="72"
            lengthAdjust="spacingAndGlyphs"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            SORTED
          </text>
        </motion.g>
      </svg>
    </motion.div>
  );
}

export default function PainSolutions() {
  const { ref: headRef, reduce: headReduce, on: headOn, text: headText } = useEntrance<HTMLDivElement>("-8% 0px");
  const { kicker, standfirst, rows } = useStudio().copy.pain;

  return (
    <section id="solutions" className="scroll-mt-6 overflow-x-clip px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div ref={headRef} className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
          <motion.div variants={rise} initial={false} animate={headText} className="min-w-0">
            <p className="font-mono text-[11.5px] uppercase tracking-[0.22em] text-muted">{kicker}</p>
            <h2 className="display mt-3 text-[clamp(44px,8.6vw,104px)] leading-[0.92] tracking-[-0.03em]">
              <span className="block">
                From{" "}
                <StruckWord on={headOn} reduce={headReduce}>
                  stuck
                </StruckWord>
              </span>
              <span className="block pl-[0.4em] sm:pl-[0.9em]">
                to{" "}
                <CircledWord on={headOn} reduce={headReduce}>
                  sorted
                </CircledWord>
              </span>
            </h2>
          </motion.div>

          <motion.div variants={rise} initial={false} animate={headText} className="relative lg:pb-3">
            <p className="max-w-[320px] text-[15px] leading-relaxed text-[#2d2f31] sm:text-[16px]">{standfirst}</p>
            <svg aria-hidden viewBox="0 0 90 80" className="pointer-events-none absolute -bottom-[72px] -left-[40px] hidden h-[80px] w-[90px] overflow-visible lg:block">
              <g fill="none" stroke={PINK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <motion.path d="M80 6 C 60 10, 30 22, 22 58" variants={pen(1.45, 0.45, 1, "easeInOut")} initial={headReduce ? false : "hidden"} animate={headOn ? "shown" : "hidden"} />
                <motion.path d="M12 48 L 22 60 L 32 50" variants={pen(1.85, 0.2)} initial={headReduce ? false : "hidden"} animate={headOn ? "shown" : "hidden"} />
              </g>
            </svg>
          </motion.div>
        </div>

        <div className="relative">
          <ol role="list" className="mt-12 border-t-2 border-foreground lg:mt-16">
            {rows.map((r, i) => (
              <Row key={r.pain} i={i} {...r} />
            ))}
          </ol>
          <div className="mt-5 flex justify-end lg:absolute lg:-bottom-[76px] lg:right-6 lg:mt-0">
            <Stamp />
          </div>
        </div>
      </div>
    </section>
  );
}
