"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, type MotionValue } from "framer-motion";
import Confetti from "./Confetti";
import { transformation } from "@/content/college-launch";
import { useRange } from "@/lib/useRange";

const SCATTER = [
  { x: -240, y: -130, r: -16 },
  { x: 260, y: -40, r: 12 },
  { x: -110, y: 180, r: 9 },
];

function ShedWord({ word, i, p }: { word: string; i: number; p: MotionValue<number> }) {
  const s = SCATTER[i % SCATTER.length];
  const x = useRange(p, [0.05, 0.32], [0, s.x]);
  const y = useRange(p, [0.05, 0.32], [0, s.y]);
  const rotate = useRange(p, [0.05, 0.32], [0, s.r]);
  const opacity = useRange(p, [0, 0.1, 0.3], [1, 1, 0]);
  const filter = useRange(p, [0.05, 0.3], ["blur(0px)", "blur(14px)"]);
  const strike = useRange(p, [0, 0.09], [0, 1]);

  return (
    <motion.span
      style={{ x, y, rotate, opacity, filter }}
      className="relative block font-[family-name:var(--font-unbounded)] text-[clamp(28px,5.4vw,70px)] font-extrabold leading-[1.1] text-[#ff8fb3]"
    >
      {word}
      <motion.span
        aria-hidden
        style={{ scaleX: strike }}
        className="absolute left-[-3%] top-[55%] h-[0.09em] w-[106%] origin-left rounded bg-white"
      />
    </motion.span>
  );
}

export default function SunriseScene() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [burst, setBurst] = useState(0);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const bg = useRange(p, [0, 0.3, 0.55, 0.8, 1], ["#22062a", "#4a0d3e", "#b8336a", "#ff7a3d", "#ff9a4d"]);
  const sunY = useRange(p, [0.15, 0.85], ["62%", "0%"]);
  const sunOpacity = useRange(p, [0.2, 0.5], [0, 1]);
  const raysOpacity = useRange(p, [0.55, 0.8], [0, 0.6]);
  const enoughOpacity = useRange(p, [0.18, 0.3, 0.44, 0.52], [0, 1, 1, 0]);
  const enoughScale = useRange(p, [0.18, 0.52], [0.85, 1.12]);
  const turnOpacity = useRange(p, [0.52, 0.66], [0, 1]);
  const turnY = useRange(p, [0.52, 0.68], [50, 0]);
  const turnScale = useRange(p, [0.52, 0.68], [0.9, 1]);
  const proofOpacity = useRange(p, [0.66, 0.78], [0, 1]);
  const hintOpacity = useRange(p, [0, 0.06], [1, 0]);

  useMotionValueEvent(p, "change", (v) => {
    if (v > 0.7 && burst === 0) setBurst(1);
  });

  if (reduce) {
    return (
      <section data-offer-zone="transform" className="bg-[#ff9a4d] px-5 py-28 text-center">
        <h2 className="display text-[clamp(40px,7vw,96px)] leading-none">{transformation.turn}</h2>
        <p className="mt-5 text-lg text-white/90">{transformation.proof}</p>
      </section>
    );
  }

  return (
    <section ref={ref} data-offer-zone="transform" className="relative h-[200vh]">
      <motion.div
        style={{ backgroundColor: bg }}
        className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden px-5"
      >
        <motion.div
          aria-hidden
          style={{ y: sunY, opacity: sunOpacity }}
          className="absolute -bottom-[55vmax] left-1/2 -ml-[55vmax] h-[110vmax] w-[110vmax]"
        >
          <motion.div
            style={{ opacity: raysOpacity }}
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-12%] rounded-full bg-[repeating-conic-gradient(from_0deg,rgba(255,240,200,.35)_0deg_6deg,transparent_6deg_18deg)] [mask-image:radial-gradient(circle,#000_30%,transparent_68%)]"
          />
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,#ffe08a_0%,#ffb347_25%,#ff7a59_45%,rgba(255,46,147,.6)_62%,transparent_72%)] blur-[10px]" />
        </motion.div>

        <div className="absolute flex flex-col items-center text-center">
          {transformation.shed.map((w, i) => (
            <ShedWord key={w} word={w} i={i} p={p} />
          ))}
        </div>

        <motion.h2
          style={{ opacity: enoughOpacity, scale: enoughScale }}
          className="display absolute px-5 text-center text-[clamp(56px,10vw,140px)] leading-none"
        >
          {transformation.enough}
        </motion.h2>

        <motion.div style={{ opacity: turnOpacity, y: turnY, scale: turnScale }} className="relative px-5 text-center">
          <Confetti burst={burst} />
          <h2 className="display mx-auto max-w-4xl text-balance text-[clamp(42px,7.5vw,104px)] leading-[0.98] [text-shadow:0_10px_50px_rgba(120,0,60,.35)]">
            {transformation.turn}
          </h2>
          <motion.p style={{ opacity: proofOpacity }} className="mt-5 text-[clamp(16px,1.8vw,21px)] font-semibold">
            {transformation.proof}
          </motion.p>
        </motion.div>

        <motion.p style={{ opacity: hintOpacity }} className="absolute bottom-8 text-[11px] uppercase tracking-[0.3em] text-white/50">
          Keep scrolling
        </motion.p>
      </motion.div>
    </section>
  );
}
