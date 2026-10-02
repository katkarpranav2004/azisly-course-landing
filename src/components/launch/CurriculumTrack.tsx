"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Hammer } from "lucide-react";
import { BUILD_COUNT, MODULE_COUNT, curriculum } from "@/content/shared";

// Blue → cyan → violet → pink → green: the colour itself tells the journey.
const COLORS = [
  "#4f7cff", "#38bdf8", "#22d3ee", "#2dd4bf", "#818cf8", "#a78bfa", "#c084fc",
  "#e879f9", "#f472b6", "#fb7185", "#facc15", "#a3e635", "#34d399",
];

const VARIANTS = {
  launch: {
    bg: "radial-gradient(ellipse 70% 50% at 50% 30%, #121a4a 0%, #0a0f2a 50%, #050816 100%)",
    node: "#0b1024",
    panel: "bg-[#0a0f26]/85",
    eyebrow: "text-[#a5b4ff]",
    unit: "Module",
    plural: "modules",
  },
  sunset: {
    bg: "radial-gradient(ellipse 70% 50% at 50% 30%, #4a1366 0%, #26093a 50%, #14051f 100%)",
    node: "#26093a",
    panel: "bg-[#2a0b3d]/85",
    eyebrow: "text-[#ffb3d9]",
    unit: "Level",
    plural: "levels",
  },
};

export default function CurriculumTrack({ variant = "launch" }: { variant?: keyof typeof VARIANTS }) {
  const v = VARIANTS[variant];
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-30%" });
  const m = curriculum[active];
  const color = COLORS[active];

  useEffect(() => {
    if (touched || !inView) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % curriculum.length), 3200);
    return () => clearTimeout(t);
  }, [active, touched, inView]);

  useEffect(() => {
    const node = trackRef.current?.querySelector<HTMLElement>(`[data-node="${active}"]`);
    const track = trackRef.current;
    if (node && track) track.scrollTo({ left: node.offsetLeft - track.clientWidth / 2 + node.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  const go = (i: number) => {
    setTouched(true);
    setActive((i + curriculum.length) % curriculum.length);
  };

  return (
    <section
      ref={ref}
      data-offer-zone="modules"
      className="relative overflow-hidden px-5 py-20 sm:py-28"
      style={{ background: v.bg }}
    >
      <motion.div
        aria-hidden
        animate={{ backgroundColor: color }}
        transition={{ duration: 0.8 }}
        className="absolute left-1/2 top-[45%] h-80 w-[50%] -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
      />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className={`eyebrow ${v.eyebrow}`}>Curriculum</p>
          <h2 className="display mt-3 text-[clamp(32px,4.8vw,60px)] leading-none">
            {MODULE_COUNT} {v.plural}. <span className="accent-text">{BUILD_COUNT} real builds.</span>
          </h2>
          <p className="mt-4 text-[15px] text-muted">From AI Curious to AI Corporate Analyst, one session at a time.</p>
        </motion.div>

        <div className="mt-12 flex items-center justify-between text-[10.5px] font-semibold uppercase tracking-[0.2em]">
          <span style={{ color: COLORS[0] }}>AI Curious</span>
          <span style={{ color: COLORS[COLORS.length - 1] }}>AI Corporate Analyst</span>
        </div>

        <div ref={trackRef} className="relative mt-3 overflow-x-auto pb-2 [scrollbar-width:none]">
          <div className="relative mx-auto flex w-max min-w-full items-center justify-between gap-3 px-4 py-5">
            <div
              aria-hidden
              className="absolute left-10 right-10 top-1/2 h-[2px] -translate-y-1/2 rounded-full opacity-40"
              style={{ background: `linear-gradient(90deg, ${COLORS.join(",")})` }}
            />
            <motion.div
              aria-hidden
              className="absolute left-10 top-1/2 h-[3px] -translate-y-1/2 rounded-full"
              style={{ background: `linear-gradient(90deg, ${COLORS.slice(0, active + 1).join(",")}${active === 0 ? "," + COLORS[0] : ""})` }}
              animate={{ width: `calc(${(active / (curriculum.length - 1)) * 100}% - ${(active / (curriculum.length - 1)) * 80}px)` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
            {curriculum.map((mod, i) => {
              const on = i === active;
              const done = i < active;
              return (
                <button
                  key={mod.index}
                  data-node={i}
                  onClick={() => go(i)}
                  onMouseEnter={() => go(i)}
                  aria-label={`${v.unit} ${mod.index}: ${mod.title}`}
                  className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-mono text-[13px] font-bold transition-all duration-300"
                  style={{
                    background: on ? COLORS[i] : done ? `${COLORS[i]}33` : v.node,
                    color: on ? "#050816" : COLORS[i],
                    boxShadow: on ? `0 0 0 4px ${COLORS[i]}33, 0 0 30px ${COLORS[i]}` : `inset 0 0 0 1.5px ${COLORS[i]}80`,
                    transform: on ? "scale(1.18)" : "scale(1)",
                  }}
                >
                  {String(mod.index).padStart(2, "0")}
                  {mod.tag === "Build" && !on && (
                    <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#050816]" style={{ background: COLORS[i] }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative mx-auto mt-8 max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={m.index}
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) go(active + 1);
                else if (info.offset.x > 60) go(active - 1);
              }}
              className={`relative cursor-grab overflow-hidden rounded-[24px] border border-white/10 p-6 backdrop-blur active:cursor-grabbing sm:p-8 ${v.panel}`}
              style={{ boxShadow: `0 30px 80px -40px ${color}` }}
            >
              <div aria-hidden className="absolute inset-y-0 left-0 w-1" style={{ background: color }} />
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-[13px] font-bold" style={{ color }}>
                  {v.unit.toUpperCase()} {String(m.index).padStart(2, "0")}
                </span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-muted">{m.stage}</span>
                {m.tag && (
                  <span
                    className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={{ color, background: `${color}1f` }}
                  >
                    {m.tag === "Build" && <Hammer size={11} />}
                    {m.tag}
                  </span>
                )}
              </div>
              <h3 className="display mt-3 text-[clamp(24px,3vw,34px)] leading-tight">{m.title}</h3>
              <p className="mt-3 text-[15.5px] leading-relaxed text-white/75">{m.description}</p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-5 flex items-center justify-between">
            <button onClick={() => go(active - 1)} aria-label="Previous module" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:bg-white/5 hover:text-white">
              <ChevronLeft size={18} />
            </button>
            <span className="font-mono text-[12px] tabular-nums text-muted">
              {String(active + 1).padStart(2, "0")} / {MODULE_COUNT}
            </span>
            <button onClick={() => go(active + 1)} aria-label="Next module" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:bg-white/5 hover:text-white">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
