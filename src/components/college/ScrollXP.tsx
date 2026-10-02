"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { curriculum } from "@/content/shared";

/** Page-wide XP bar: scrolling "levels you up" through the 13 course stages. */
export default function ScrollXP({ showChip }: { showChip: boolean }) {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const [level, setLevel] = useState(1);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(curriculum.length, Math.max(1, Math.ceil(v * curriculum.length)));
    if (next !== level) setLevel(next);
  });

  const stage = curriculum[level - 1].stage;

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 h-1.5 bg-white/10">
        <motion.div
          style={{ scaleX: width }}
          className="h-full origin-left bg-gradient-to-r from-[#ffd23f] via-[#ff8ad8] to-[#8ab4ff] shadow-[0_0_12px_rgba(255,210,63,.8)]"
        />
      </div>
      <div className="pointer-events-none fixed right-3 top-3.5 z-50 hidden sm:block">
        <AnimatePresence mode="popLayout" initial={false}>
          {showChip && (
          <motion.div
            key={level}
            initial={{ y: -16, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: [0.8, 1.15, 1] }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 rounded-full border border-white/40 bg-[#3a0f47]/60 py-1.5 pl-1.5 pr-3 text-[11.5px] font-semibold backdrop-blur-md"
          >
            <span className="rounded-full bg-gradient-to-r from-[#ffd23f] to-[#ffb347] px-2 py-0.5 font-[family-name:var(--font-unbounded)] text-[10px] font-extrabold text-[#1a0a2e]">
              LV {String(level).padStart(2, "0")}
            </span>
            {stage}
          </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
