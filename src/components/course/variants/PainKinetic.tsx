"use client";

import { Fragment, useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ChevronDown, FileText } from "lucide-react";
import { course } from "@/content/course";

const EYEBROW = "Five edits to your work week";
const FILE_STEM = "my-week_";
const FILE_BEFORE = "stuck";
const FILE_AFTER = "sorted";
const TRACK_LABEL = "Track changes";
const FIXED_IN = "Fixed in";

const ROWS = course.painSolutions;
const TOTAL = ROWS.length;
const RISE = "cubic-bezier(0.22,1,0.36,1)";
const pad = (n: number | string) => String(n).padStart(2, "0");

const noopSubscribe = () => () => {};
/** false on the server and during hydration, true after. */
const useHydrated = () => useSyncExternalStore(noopSubscribe, () => true, () => false);

/**
 * The server renders every edit un-played so nothing flashes before the cascade. If scripts never
 * arrive, this reveals the finished document after a beat (at once under reduced motion).
 */
const SAFETY_NET = `@keyframes pk-reveal{to{opacity:1;transform:none;stroke-dasharray:none}}
.pk-wait [data-pk]{animation:pk-reveal 0s linear 2.5s forwards}
@media (prefers-reduced-motion:reduce){.pk-wait [data-pk]{animation-delay:0s}}`;

/** CSS transition for one transform/opacity step; instant when going back to rest or when motion is off. */
function step(on: boolean, live: boolean, delay: number, dur: number, ease = "ease-out"): CSSProperties {
  return { transition: on && live ? `transform ${dur}s ${ease} ${delay}s, opacity ${dur}s ${ease} ${delay}s` : "none" };
}

function modulesOf(source: string) {
  return { nums: (source.match(/\d+/g) ?? []).map(pad), sep: source.includes(" to ") ? "to" : "&" };
}

/** "Modules 6 to 9" -> "4 modules", derived straight from the source string. */
function moduleCount(source: string) {
  const n = (source.match(/\d+/g) ?? []).map(Number);
  const count = source.includes(" to ") && n.length === 2 ? n[1] - n[0] + 1 : n.length;
  return `${count} module${count === 1 ? "" : "s"}`;
}

/** The hero's flip tile: dark face, white mono digits, a hairline across the middle. */
function Tile({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-[6px] bg-[#1c1d1f] px-1 font-mono font-bold tabular-nums text-white shadow-[inset_0_-1px_0_rgba(255,255,255,.08)] ${className}`}
    >
      {children}
      <span aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-black/40" />
    </span>
  );
}

function ModuleTiles({ source, on, live, size }: { source: string; on: boolean; live: boolean; size: "sm" | "md" }) {
  const { nums, sep } = modulesOf(source);
  const tile = size === "md" ? "h-[26px] min-w-[28px] text-[12.5px]" : "h-[22px] min-w-[24px] text-[11.5px]";
  return (
    <>
      {nums.map((n, k) => (
        <Fragment key={k}>
          {k > 0 && <span className="font-mono text-[11px] text-muted">{sep}</span>}
          <span
            data-pk
            className="inline-flex motion-reduce:transition-none"
            style={{ transform: `translateY(${on ? 0 : -8}px)`, opacity: on ? 1 : 0.2, ...step(on, live, 1.2 + k * 0.06, 0.28) }}
          >
            <Tile className={tile}>{n}</Tile>
          </span>
        </Fragment>
      ))}
    </>
  );
}

/** Pink editor's pen through the pain, one word at a time. */
function StruckText({ text, on, live }: { text: string; on: boolean; live: boolean }) {
  const words = text.split(" ");
  return (
    <del className="no-underline">
      {words.map((w, k) => {
        const last = k === words.length - 1;
        return (
          <Fragment key={k}>
            <span className="relative inline-block">
              {w}
              <span
                data-pk
                className="pointer-events-none absolute -left-px top-[56%] h-[2px] origin-left rounded-full bg-[#ff4fd8] shadow-[0_0_6px_rgba(255,79,216,.55)] motion-reduce:transition-none"
                style={{
                  right: last ? -1 : "-0.3em",
                  transform: `rotate(${k % 2 ? 0.5 : -0.8}deg) scaleX(${on ? 1 : 0})`,
                  ...step(on, live, 0.05 + k * 0.04, 0.16),
                }}
              />
            </span>
            {!last && " "}
          </Fragment>
        );
      })}
    </del>
  );
}

/** The fix types itself in, each word underlined in mint as it lands. */
function InsertedText({ text, on, live }: { text: string; on: boolean; live: boolean }) {
  const words = text.split(" ");
  return (
    <ins className="no-underline">
      {words.map((w, k) => {
        const last = k === words.length - 1;
        const d = 0.7 + k * 0.035;
        return (
          <Fragment key={k}>
            <span
              data-pk
              className="relative inline-block motion-reduce:transition-none"
              style={{ transform: `translateY(${on ? 0 : 8}px)`, opacity: on ? 1 : 0, ...step(on, live, d, 0.3, RISE) }}
            >
              {w}
              <span
                data-pk
                className="pointer-events-none absolute -bottom-[3px] left-0 h-[3px] origin-left bg-[#6fd8b9] motion-reduce:transition-none"
                style={{ right: last ? 0 : "-0.3em", transform: `scaleX(${on ? 1 : 0})`, ...step(on, live, d + 0.12, 0.2) }}
              />
            </span>
            {!last && " "}
          </Fragment>
        );
      })}
    </ins>
  );
}

type Row = (typeof ROWS)[number];

function EditRow({
  row,
  i,
  armed,
  live,
  still,
  onArm,
  onFix,
}: {
  row: Row;
  i: number;
  armed: number;
  live: boolean;
  still: boolean;
  onArm: (n: number) => void;
  onFix: () => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -25% 0px" });
  const play = live && inView && armed >= i;
  const on = still || play;

  useEffect(() => {
    if (!play) return;
    const a = setTimeout(() => onArm(i + 1), 450);
    const f = setTimeout(onFix, 1250);
    return () => {
      clearTimeout(a);
      clearTimeout(f);
    };
  }, [play, i, onArm, onFix]);

  return (
    <li
      ref={ref}
      className="group relative grid grid-cols-[28px_minmax(0,1fr)] gap-x-3 border-b border-dashed border-[#e3e6eb] px-4 py-5 transition-colors last:rounded-b-[18px] last:border-0 md:grid-cols-[72px_minmax(0,1fr)_248px] md:gap-x-0 md:p-0 md:hover:bg-[#fdfbff]"
    >
      <p className="sr-only">
        Before: {row.pain}. After: {row.solution}. {row.source}.
      </p>

      {/* "accepted" wash once the insert lands */}
      <motion.span
        aria-hidden
        initial={false}
        animate={{ opacity: play ? [0, 1, 0] : 0 }}
        transition={play ? { duration: 0.9, delay: 1.05, ease: "easeInOut", type: "tween" } : { duration: 0 }}
        className="pointer-events-none absolute inset-0 bg-[#effaf6] group-last:rounded-b-[18px]"
      />

      {/* gutter, deleted line: number, minus, and the pen's connector down to the insert */}
      <div aria-hidden className="relative col-start-1 row-start-1 md:pl-5 md:pr-3 md:pt-6">
        <div className="flex h-[22.5px] items-center justify-between md:h-[25px]">
          <span className="font-mono text-[10px] leading-none text-[#9aa0a6] md:text-[11px]">{pad(i + 1)}</span>
          <span className="flex w-3 justify-center font-mono text-[18px] font-bold leading-none text-[#d6119b]">{"−"}</span>
        </div>
        <span
          data-pk
          className="absolute -bottom-[13px] right-[5px] top-[18px] w-[2px] origin-top rounded-full bg-[#ff4fd8] motion-reduce:transition-none md:-bottom-[17px] md:right-[17px] md:top-[43px]"
          style={{ transform: `scaleY(${on ? 1 : 0})`, ...step(on, live, 0.5, 0.25) }}
        />
      </div>

      <p aria-hidden className="relative col-start-2 row-start-1 text-[15.5px] font-medium leading-[1.45] text-[#4b4f53] md:pl-5 md:pr-10 md:pt-6 md:text-[17px]">
        <StruckText text={row.pain} on={on} live={live} />
      </p>

      {/* gutter, inserted line */}
      <div aria-hidden className="relative col-start-1 row-start-2 pt-2.5 md:pl-5 md:pr-3 md:pt-3">
        <div className="flex h-[25px] items-center justify-end md:h-[29px]">
          <span className="relative flex w-3 justify-center">
            <span
              data-pk
              className="absolute bottom-full left-1/2 -mb-[4px] -ml-[6px] flex text-[#ff4fd8] motion-reduce:transition-none"
              style={{ transform: `scale(${on ? 1 : 0.4})`, opacity: on ? 1 : 0, ...step(on, live, 0.7, 0.2) }}
            >
              <ChevronDown size={12} strokeWidth={3} />
            </span>
            <motion.span
              data-pk
              initial={false}
              animate={on ? { opacity: 1, scale: [0.6, 1.18, 1] } : { opacity: 0, scale: 0.6 }}
              transition={on && live ? { duration: 0.35, delay: 1.05, ease: "easeOut", type: "tween" } : { duration: 0 }}
              className="font-mono text-[18px] font-bold leading-none text-success"
            >
              +
            </motion.span>
          </span>
        </div>
      </div>

      <div aria-hidden className="relative col-start-2 row-start-2 pt-2.5 md:pb-6 md:pl-5 md:pr-10 md:pt-3">
        <p className="font-[family-name:var(--font-serif)] text-[19px] font-semibold leading-[1.3] text-[#1c1d1f] md:text-[23px] md:leading-[1.25]">
          <InsertedText text={row.solution} on={on} live={live} />
        </p>
      </div>

      {/* mobile: the comment drops inline under the fix */}
      <div
        aria-hidden
        data-pk
        className="relative col-start-2 row-start-3 mt-3 flex flex-wrap items-center gap-1.5 motion-reduce:transition-none md:hidden"
        style={{ transform: `translateX(${on ? 0 : 10}px)`, opacity: on ? 1 : 0, ...step(on, live, 1.15, 0.35) }}
      >
        <span className="mr-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{FIXED_IN}</span>
        <ModuleTiles source={row.source} on={on} live={live} size="sm" />
      </div>

      {/* desktop: comment rail with a balloon pinned to the inserted line */}
      <div
        aria-hidden
        className="relative col-start-3 row-span-2 row-start-1 hidden items-end border-l border-[#e3e6eb] bg-[#f7f9fa] px-4 pb-6 group-last:rounded-br-[18px] md:flex"
      >
        <span
          data-pk
          className="block w-full motion-reduce:transition-none"
          style={{ transform: `translateX(${on ? 0 : 10}px)`, opacity: on ? 1 : 0, ...step(on, live, 1.15, 0.35) }}
        >
          <span className="relative block rounded-[10px] border border-[#e3e6eb] bg-white px-3 py-2.5 shadow-[0_8px_18px_-14px_rgba(28,29,31,.5)] transition-[transform,border-color] duration-200 group-hover:-translate-y-0.5 group-hover:border-[#5624d0]/30">
            <span
              data-pk
              className="absolute right-full top-1/2 block w-7 origin-right border-t-[1.5px] border-dashed border-[#ff4fd8] group-hover:border-solid motion-reduce:transition-none"
              style={{ transform: `scaleX(${on ? 1 : 0})`, ...step(on, live, 1.15, 0.25) }}
            >
              <span className="absolute -left-[3px] -top-[3.75px] h-1.5 w-1.5 rounded-full bg-[#ff4fd8]" />
            </span>
            <span className="flex items-baseline justify-between gap-2 font-mono text-[10px] uppercase leading-none tracking-[0.18em] text-muted">
              {FIXED_IN}
              <span className="tracking-[0.08em] text-[#9aa0a6]">{moduleCount(row.source)}</span>
            </span>
            <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <ModuleTiles source={row.source} on={on} live={live} size="md" />
            </span>
          </span>
        </span>
      </div>
    </li>
  );
}

function Toolbar({ fixed, sorted, strike, live }: { fixed: number; sorted: boolean; strike: boolean; live: boolean }) {
  return (
    <div
      aria-hidden
      className="sticky top-[65px] z-20 grid h-11 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-t-[18px] border-b border-[#e3e6eb] bg-[#fbfbfc] px-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:relative md:top-auto md:px-5"
    >
      <span className="flex min-w-0 items-center gap-2">
        <FileText size={15} className="shrink-0 text-muted" />
        <span className="min-w-0 truncate font-mono text-[11.5px] text-foreground md:text-[12.5px]">
          {FILE_STEM}
          <span className="relative inline-block">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={sorted ? "after" : "before"}
                initial={{ y: 6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: live ? 0.25 : 0 }}
                className={`relative inline-block ${sorted ? "font-semibold text-success" : "text-muted"}`}
              >
                {sorted ? FILE_AFTER : FILE_BEFORE}
                {!sorted && (
                  <span
                    className="absolute -inset-x-px top-[56%] h-[2px] origin-left rounded-full bg-[#ff4fd8] shadow-[0_0_6px_rgba(255,79,216,.55)] motion-reduce:transition-none"
                    style={{ transform: `scaleX(${strike ? 1 : 0})`, ...step(strike, live, 0.3, 0.25) }}
                  />
                )}
              </motion.span>
            </AnimatePresence>
          </span>
          .docx
        </span>
      </span>

      <span className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted sm:flex">
        <span className="h-[7px] w-[7px] rounded-full bg-[#ff4fd8] shadow-[0_0_6px_rgba(255,79,216,.6)]" />
        {TRACK_LABEL}
      </span>

      <span className="flex shrink-0 items-center gap-1.5 justify-self-end">
        <span className="text-[12.5px] font-semibold">Fixed</span>
        <Tile className="h-6 min-w-[22px] text-[13px]">
          <motion.span key={fixed} initial={live ? { y: -10, opacity: 0.2 } : false} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.28, ease: "easeOut" }}>
            {fixed}
          </motion.span>
        </Tile>
        <span className="font-mono text-[12.5px] text-muted">/{TOTAL}</span>
      </span>

      <motion.span
        initial={false}
        animate={{ scaleX: fixed / TOTAL }}
        transition={live ? { type: "spring", stiffness: 220, damping: 30 } : { duration: 0 }}
        style={{ originX: 0 }}
        className="absolute inset-x-0 bottom-0 h-[2px] bg-[#6fd8b9]"
      />
    </div>
  );
}

/** A hand-drawn mark over a heading word, in the hero whoosh's pen. */
function Marked({
  children,
  mark,
  live,
  still,
  className = "",
}: {
  children: ReactNode;
  mark: "strike" | "swoosh";
  live: boolean;
  still: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const strike = mark === "strike";
  const drawn = still || (live && inView);
  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      {children}
      <svg
        aria-hidden
        viewBox="0 0 120 20"
        preserveAspectRatio="none"
        className={`pointer-events-none absolute -left-[4%] w-[108%] overflow-visible ${strike ? "top-[36%] h-[0.34em]" : "-bottom-[0.2em] h-[0.3em]"}`}
      >
        <motion.path
          data-pk
          d={strike ? "M2 16 C 34 11, 74 18, 118 10" : "M2 6 C 30 15, 78 16, 118 5"}
          fill="none"
          stroke={strike ? "#ff4fd8" : "#6fd8b9"}
          strokeWidth={strike ? 5 : 6}
          strokeLinecap="round"
          style={strike ? { filter: "drop-shadow(0 0 6px rgba(255,79,216,.7))" } : undefined}
          initial={false}
          animate={drawn ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={drawn && live ? { duration: strike ? 0.45 : 0.5, delay: strike ? 0.3 : 0.75, ease: "easeOut" } : { duration: 0 }}
        />
      </svg>
    </span>
  );
}

export default function PainKinetic() {
  const hydrated = useHydrated();
  const reduce = useReducedMotion();
  const live = hydrated && !reduce;
  const still = hydrated && !!reduce;

  const [armed, setArmed] = useState(0);
  const [fixedLive, setFixedLive] = useState(0);
  const [sortedLive, setSortedLive] = useState(false);
  const onArm = useCallback((n: number) => setArmed((a) => Math.max(a, n)), []);
  const onFix = useCallback(() => setFixedLive((f) => Math.min(TOTAL, f + 1)), []);

  const fixed = still ? TOTAL : fixedLive;
  const done = fixed === TOTAL;
  const sorted = still || sortedLive;

  useEffect(() => {
    if (!live || !done) return;
    const t = setTimeout(() => setSortedLive(true), 650);
    return () => clearTimeout(t);
  }, [live, done]);

  return (
    <section className={`scroll-mt-6 overflow-x-clip px-5 py-20 sm:py-24 ${hydrated ? "" : "pk-wait"}`}>
      <style>{SAFETY_NET}</style>
      <div className="mx-auto max-w-6xl">
        <p className="text-center font-mono text-[11.5px] uppercase tracking-[0.2em] text-muted">{EYEBROW}</p>
        <h2 className="display mt-3 text-center text-[clamp(30px,4.4vw,50px)] leading-[1.05]">
          From{" "}
          <Marked mark="strike" live={live} still={still}>
            stuck
          </Marked>{" "}
          to{" "}
          <Marked mark="swoosh" live={live} still={still} className="accent-text">
            sorted
          </Marked>
        </h2>

        <div className="relative isolate mx-auto mt-10 max-w-[1040px]">
          <div aria-hidden className="absolute inset-0 -z-10 hidden translate-x-2 translate-y-2.5 rotate-[1.2deg] rounded-[18px] border border-[#e3e6eb] bg-[#fafafa] md:block" />
          <div className="relative rounded-[18px] border border-[#e3e6eb] bg-white shadow-[0_24px_48px_-32px_rgba(28,29,31,.45)]">
            <Toolbar fixed={fixed} sorted={sorted} strike={done} live={live} />
            {/* legal-pad margin rule */}
            <span aria-hidden className="pointer-events-none absolute bottom-0 left-[50px] top-11 z-10 w-px bg-[#ffd0ee] md:left-[72px]" />
            <ol>
              {ROWS.map((row, i) => (
                <EditRow key={row.pain} row={row} i={i} armed={armed} live={live} still={still} onArm={onArm} onFix={onFix} />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
