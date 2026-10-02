"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  type MotionValue,
} from "framer-motion";
import { transformation } from "@/content/corporate-launch";
import { useRange } from "@/lib/useRange";


const SCATTER = [
  { x: -260, y: -140, r: -18 },
  { x: 280, y: -60, r: 14 },
  { x: -120, y: 200, r: 10 },
];

function ShedWord({ word, i, p }: { word: string; i: number; p: MotionValue<number> }) {
  const s = SCATTER[i % SCATTER.length];
  const x = useRange(p, [0.04, 0.3], [0, s.x]);
  const y = useRange(p, [0.04, 0.3], [0, s.y]);
  const rotate = useRange(p, [0.04, 0.3], [0, s.r]);
  const opacity = useRange(p, [0, 0.08, 0.28], [1, 1, 0]);
  const blur = useRange(p, [0.04, 0.28], ["blur(0px)", "blur(14px)"]);
  const strike = useRange(p, [0, 0.08], [0, 1]);

  return (
    <motion.span
      style={{ x, y, rotate, opacity, filter: blur }}
      className="relative block text-[clamp(30px,6vw,76px)] font-extrabold leading-[1.05] tracking-tight text-[#ff4d6d]"
    >
      {word}
      <motion.span
        aria-hidden
        style={{ scaleX: strike }}
        className="absolute left-[-3%] top-[54%] h-[0.09em] w-[106%] origin-left rounded bg-white/85"
      />
    </motion.span>
  );
}

function Particles({ active }: { active: MotionValue<number> }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const on = useRef(false);
  useMotionValueEvent(active, "change", (v) => (on.current = v > 0.02));

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const colors = ["#22d3ee", "#34d399", "#8b9cff", "#a78bfa", "#67e8f9"];
    let dots: { x: number; y: number; vy: number; vx: number; r: number; c: string }[] = [];

    const size = () => {
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(90, (w * h) / 14000));
      dots = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(0.2 + Math.random() * 0.6),
        r: 0.6 + Math.random() * 1.8,
        c: colors[Math.floor(Math.random() * colors.length)],
      }));
    };
    size();
    window.addEventListener("resize", size);

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!on.current) return;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        d.x += d.vx;
        d.y += d.vy;
        if (d.y < -10) {
          d.y = h + 10;
          d.x = Math.random() * w;
        }
        for (let j = i + 1; j < dots.length; j++) {
          const e = dots[j];
          const dist = Math.hypot(d.x - e.x, d.y - e.y);
          if (dist < 110) {
            ctx.strokeStyle = `rgba(103,232,249,${(1 - dist / 110) * 0.18})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(e.x, e.y);
            ctx.stroke();
          }
        }
        ctx.fillStyle = d.c;
        ctx.shadowColor = d.c;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
    };
  }, []);

  return (
    <motion.canvas ref={ref} style={{ opacity: active }} className="absolute inset-0 h-full w-full" />
  );
}

export default function TransformScene() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const bg = useRange(
    p,
    [0, 0.2, 0.38, 0.55, 0.75, 1],
    ["#12040a", "#3d0a33", "#2a0f63", "#0d2475", "#05404f", "#043a2c"]
  );
  const waveX = useRange(p, [0.12, 0.9], ["-90%", "90%"]);
  const waveOpacity = useRange(p, [0.1, 0.25, 0.8, 1], [0, 0.75, 0.6, 0.2]);
  const enoughOpacity = useRange(p, [0.2, 0.32, 0.46, 0.56], [0, 1, 1, 0]);
  const enoughScale = useRange(p, [0.2, 0.56], [0.92, 1.06]);
  const enoughBlur = useRange(p, [0.46, 0.56], ["blur(0px)", "blur(10px)"]);
  const turnOpacity = useRange(p, [0.56, 0.7], [0, 1]);
  const turnY = useRange(p, [0.56, 0.72], [50, 0]);
  const turnScale = useRange(p, [0.56, 0.72], [0.9, 1]);
  const proofOpacity = useRange(p, [0.7, 0.82], [0, 1]);
  const particles = useRange(p, [0.5, 0.75], [0, 1]);
  const hintOpacity = useRange(p, [0, 0.06], [1, 0]);

  if (reduce) {
    return (
      <section data-offer-zone="transform" className="bg-[#043a2c] px-5 py-28 text-center">
        <h2 className="display text-[clamp(40px,7vw,96px)] leading-none">{transformation.turn}</h2>
        <p className="mt-5 text-lg text-white/80">{transformation.proof}</p>
      </section>
    );
  }

  return (
    <section ref={ref} data-offer-zone="transform" className="relative h-[210vh]">
      <motion.div
        style={{ backgroundColor: bg }}
        className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden px-5"
      >
        <motion.div
          aria-hidden
          style={{ x: waveX, opacity: waveOpacity }}
          className="absolute h-[140%] w-[75%] rounded-full bg-[linear-gradient(90deg,#ff2d55,#c026d3,#6366f1,#22d3ee,#34d399)] blur-[140px]"
        />
        <Particles active={particles} />

        <div className="absolute flex flex-col items-center text-center">
          {transformation.shed.map((w, i) => (
            <ShedWord key={w} word={w} i={i} p={p} />
          ))}
        </div>

        <motion.h2
          style={{ opacity: enoughOpacity, scale: enoughScale, filter: enoughBlur }}
          className="display absolute px-5 text-center text-[clamp(40px,7.4vw,104px)] leading-none text-white"
        >
          {transformation.enough}
        </motion.h2>

        <motion.div style={{ opacity: turnOpacity, y: turnY, scale: turnScale }} className="relative px-5 text-center">
          <h2 className="display text-[clamp(44px,8vw,116px)] leading-[0.95]">
            <span className="bg-[linear-gradient(100deg,#a5f3fc,#6ee7b7_45%,#bef264)] bg-clip-text text-transparent [filter:drop-shadow(0_0_40px_rgba(52,211,153,.35))]">
              {transformation.turn}
            </span>
          </h2>
          <motion.p style={{ opacity: proofOpacity }} className="mt-6 text-[clamp(16px,1.8vw,21px)] font-medium text-white/85">
            {transformation.proof}
          </motion.p>
        </motion.div>

        <motion.p
          style={{ opacity: hintOpacity }}
          className="absolute bottom-8 text-[11px] uppercase tracking-[0.3em] text-white/45"
        >
          Keep scrolling
        </motion.p>
      </motion.div>
    </section>
  );
}
