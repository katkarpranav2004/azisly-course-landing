"use client";

import Image from "next/image";
import { useEffect, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Award, Clock, GraduationCap, Lock, Sparkles } from "lucide-react";
import { BUILD_COUNT, MODULE_COUNT, curriculum } from "@/content/shared";

/**
 * Swap the photo here. For a photo where the person holds a tablet/board, move
 * `card.className` so the card sits over their hands and match the tilt.
 */
const AVATAR = {
  src: "/hero/analyst.webp",
  imageStyle: { objectPosition: "54% 0%", transform: "scale(1.16)", transformOrigin: "52% 18%" },
  card: {
    className: "bottom-0 left-[10%] w-[262px] sm:bottom-2 sm:left-[30%] sm:w-[300px]",
    rotateX: 9,
    rotateY: -6,
  },
};

function useModuleCycle() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const last = i === curriculum.length - 1;
    const t = setTimeout(() => setI(last ? 0 : i + 1), last ? 3200 : 1700);
    return () => clearTimeout(t);
  }, [i]);
  return i;
}

function AnalystCard() {
  const i = useModuleCycle();
  const m = curriculum[i];
  const done = i === curriculum.length - 1;
  const progress = Math.round(((i + 1) / curriculum.length) * 100);

  return (
    <div className="featured">
      <div className="featured-inner p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="icon-chip h-9 w-9">
              <GraduationCap size={17} />
            </span>
            <div>
              <p className="text-[14px] font-bold leading-tight">AI Corporate Analyst</p>
              <p className="text-[10.5px] text-muted">Certified program</p>
            </div>
          </div>
          <span className="badge shrink-0 px-2 py-1 text-[10.5px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#34d399] shadow-[0_0_8px_#34d399] [animation:soft-pulse_1.6s_infinite]" />
            Live cohort
          </span>
        </div>

        <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-muted">
            <span>Now learning</span>
            <span className="font-mono tabular-nums">
              {String(m.index).padStart(2, "0")}/{MODULE_COUNT}
            </span>
          </div>
          <div className="relative mt-1.5 h-[38px] overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={m.index}
                initial={{ y: 22, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -22, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <p className="truncate text-[13.5px] font-semibold">{m.title}</p>
                <p className="text-[11px] text-[#a5b4ff]">{m.stage}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#3b6bff] via-[#7c5cff] to-[#22d3ee] transition-[width] duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          {[
            { v: MODULE_COUNT, l: "Modules" },
            { v: BUILD_COUNT, l: "Builds" },
            { v: "1:1", l: "Support" },
          ].map((s) => (
            <div key={s.l} className="rounded-lg bg-white/[0.03] py-2">
              <p className="text-[17px] font-bold leading-none">{s.v}</p>
              <p className="mt-1 text-[9.5px] uppercase tracking-[0.14em] text-muted">{s.l}</p>
            </div>
          ))}
        </div>

        <div
          className={`mt-3 flex items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-all duration-700 ${
            done ? "border-[#facc15]/40 bg-[#facc15]/[0.07]" : "border-white/[0.06]"
          }`}
        >
          {done ? <Award size={16} className="text-[#fde68a]" /> : <Lock size={14} className="text-muted" />}
          <p className={`text-[12px] font-semibold ${done ? "text-[#fde68a]" : "text-foreground/70"}`}>
            {done ? "Certificate unlocked" : "Certificate on completion"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AnalystComposition() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 70, damping: 18 });
  const sy = useSpring(my, { stiffness: 70, damping: 18 });

  const portraitX = useTransform(sx, (v) => v * -16);
  const portraitY = useTransform(sy, (v) => v * -10);
  const cardX = useTransform(sx, (v) => v * 18);
  const cardY = useTransform(sy, (v) => v * 10);
  const cardRotY = useTransform(sx, (v) => AVATAR.card.rotateY + v * 8);
  const cardRotX = useTransform(sy, (v) => AVATAR.card.rotateX - v * 6);
  const chipX = useTransform(sx, (v) => v * 36);
  const glowX = useTransform(sx, (v) => v * 40);

  function onMove(e: MouseEvent) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="relative mx-auto h-[470px] w-full max-w-[540px] [perspective:1400px] sm:h-[600px]"
    >
      <motion.div
        aria-hidden
        style={{ x: glowX }}
        className="absolute right-[6%] top-[8%] h-[70%] w-[70%] rounded-full bg-[radial-gradient(circle,rgba(59,107,255,.45),rgba(124,92,255,.22)_45%,transparent_70%)] blur-3xl"
      />

      <motion.div
        style={{ x: portraitX, y: portraitY }}
        className="absolute right-0 top-0 h-[430px] w-[76%] sm:h-[560px] sm:w-[74%]"
      >
        <motion.div
          animate={{ scale: [1, 1.018, 1], y: [0, -6, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="relative h-full w-full rounded-[34px] bg-gradient-to-br from-[#5b7cff]/60 via-white/10 to-[#a855f7]/50 p-px"
        >
          <div className="relative h-full w-full overflow-hidden rounded-[33px] bg-[#0a1030]">
            <Image
              src={AVATAR.src}
              alt="AI Corporate Analyst learner"
              fill
              priority
              sizes="(min-width: 640px) 400px, 76vw"
              className="object-cover"
              style={AVATAR.imageStyle}
            />
            <div className="absolute inset-0 bg-[#050816]/15" />
            <div className="absolute inset-0 bg-[linear-gradient(155deg,rgba(59,107,255,.28),transparent_40%,transparent_60%,rgba(124,92,255,.35))] mix-blend-soft-light" />
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#050816]/80 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-[#050816] via-[#050816]/70 to-transparent" />
            <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#050816]/60 to-transparent" />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ x: cardX, y: cardY, rotateY: cardRotY, rotateX: cardRotX }}
        className={`absolute [transform-origin:50%_100%] [transform-style:preserve-3d] ${AVATAR.card.className}`}
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <div
            aria-hidden
            className="absolute -inset-x-6 -bottom-6 top-1/3 -z-10 rounded-[40px] bg-black/60 blur-2xl"
          />
          <AnalystCard />
        </motion.div>
      </motion.div>

      <motion.div
        style={{ x: chipX }}
        className="glass-dark absolute left-[4%] top-[9%] hidden items-center gap-2.5 rounded-2xl px-3.5 py-2.5 sm:flex"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#7c5cff]/20 text-[#c4b5fd]">
          <Sparkles size={13} />
        </span>
        <div>
          <p className="text-[12px] font-semibold">{BUILD_COUNT} real AI builds</p>
          <p className="text-[10.5px] text-muted">agents · dashboard · prototype</p>
        </div>
      </motion.div>

      <motion.div
        style={{ x: chipX }}
        className="glass-dark absolute right-[-2%] top-[22%] flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#22d3ee]/15 text-[#67e8f9]">
          <Clock size={13} />
        </span>
        <div>
          <p className="text-[12px] font-semibold">3–4 hrs a week</p>
          <p className="text-[10.5px] text-muted">fits a full-time job</p>
        </div>
      </motion.div>
    </div>
  );
}
