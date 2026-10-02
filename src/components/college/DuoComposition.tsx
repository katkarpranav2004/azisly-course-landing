"use client";

import Image from "next/image";
import { type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import RoleDeck from "./RoleDeck";
import { duo } from "@/content/college-launch";

const STICKERS = [
  { e: "🚀", x: "4%", y: "6%", d: 0, depth: 34 },
  { e: "💡", x: "88%", y: "4%", d: -2, depth: 46 },
  { e: "✨", x: "-2%", y: "58%", d: -4, depth: 52 },
  { e: "🎯", x: "92%", y: "62%", d: -1, depth: 40 },
];

function Sticker({ s, mx, my }: { s: (typeof STICKERS)[number]; mx: MotionValue<number>; my: MotionValue<number> }) {
  const x = useTransform(mx, (v) => v * s.depth);
  const y = useTransform(my, (v) => v * s.depth);
  return (
    <motion.span
      aria-hidden
      style={{ left: s.x, top: s.y, x, y }}
      className="absolute z-[6] hidden text-[34px] drop-shadow-[0_8px_16px_rgba(60,0,60,.35)] sm:block"
    >
      <motion.span
        className="block"
        animate={{ y: [0, -12, 0], rotate: [0, 10, -6, 0] }}
        transition={{ duration: 5 + s.depth / 20, delay: s.d, repeat: Infinity, ease: "easeInOut" }}
      >
        {s.e}
      </motion.span>
    </motion.span>
  );
}

export default function DuoComposition() {
  const mx = useSpring(useMotionValue(0), { stiffness: 70, damping: 18 });
  const my = useSpring(useMotionValue(0), { stiffness: 70, damping: 18 });
  const leftX = useTransform(mx, (v) => v * -14);
  const rightX = useTransform(mx, (v) => v * -10);
  const passX = useTransform(mx, (v) => v * 18);
  const passY = useTransform(my, (v) => v * 10);
  const passRotY = useTransform(mx, (v) => v * 10);
  const passRotX = useTransform(my, (v) => 6 - v * 8);

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
      className="relative mx-auto h-[520px] w-full max-w-[560px] [perspective:1600px] sm:h-[580px]"
    >
      <motion.div
        aria-hidden
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-[46%] -ml-[200px] -mt-[200px] h-[400px] w-[400px] rounded-full bg-[conic-gradient(from_0deg,#ffd23f,#ff2e93,#8b2ff7,#2bb5ff,#ffd23f)] opacity-50 blur-[60px]"
      />

      {STICKERS.map((s) => (
        <Sticker key={s.e} s={s} mx={mx} my={my} />
      ))}

      {/* Boy: transparent cutout breaks out of the top of his frame */}
      <motion.div style={{ x: leftX }} className="absolute left-0 top-6 h-[330px] w-[46%] sm:h-[400px] sm:w-[47%]">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          style={{ rotateY: 16, transformOrigin: "right center" }}
          className="relative h-full w-full"
        >
          <div className="h-full w-full rounded-[30px] bg-gradient-to-br from-white/95 via-white/15 to-white/70 p-[1.5px]">
            <div className="h-full w-full rounded-[29px] bg-[radial-gradient(ellipse_70%_55%_at_50%_40%,rgba(255,255,255,.35),transparent_70%),linear-gradient(165deg,#ff8a3d_0%,#ff2e93_45%,#7b2ff7_100%)]" />
          </div>
          <Image
            src="/college/student-boy.png"
            alt="Student holding books"
            width={653}
            height={980}
            priority
            className="pointer-events-none absolute left-1/2 top-[-17%] h-[172%] w-auto max-w-none -translate-x-1/2 drop-shadow-[0_18px_30px_rgba(60,0,60,.45)] [mask-image:linear-gradient(180deg,#000_68%,transparent_68%)]"
          />
          <span className="badge absolute bottom-[50%] left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 text-[11.5px]">{duo.boyLabel}</span>
        </motion.div>
      </motion.div>

      {/* Girl */}
      <motion.div style={{ x: rightX }} className="absolute right-0 top-10 h-[330px] w-[46%] sm:h-[400px] sm:w-[47%]">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 9, delay: -4, repeat: Infinity, ease: "easeInOut" }}
          style={{ rotateY: -16, transformOrigin: "left center" }}
          className="relative h-full w-full"
        >
          <div className="h-full w-full rounded-[30px] bg-gradient-to-br from-white/95 via-white/15 to-white/70 p-[1.5px]">
            <div className="relative h-full w-full overflow-hidden rounded-[29px] bg-[#5b1a6b]">
              <Image
                src="/college/student-girl.png"
                alt="Student holding notebooks"
                fill
                priority
                sizes="(min-width: 640px) 260px, 46vw"
                className="object-cover [object-position:50%_18%] [transform-origin:50%_28%] [transform:scale(1.3)]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(165deg,rgba(255,122,24,.25),rgba(255,46,147,.18)_45%,rgba(123,47,247,.35))] mix-blend-soft-light" />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(70,10,90,.75),transparent_45%)]" />
            </div>
          </div>
          <span className="badge absolute left-1/2 top-[12%] -translate-x-1/2 whitespace-nowrap px-3 py-1.5 text-[11.5px]">{duo.girlLabel}</span>
        </motion.div>
      </motion.div>

      {/* Roles deck: replaces the old career-pass card */}
      <motion.div
        style={{ x: passX, y: passY, rotateY: passRotY, rotateX: passRotX }}
        className="absolute bottom-0 left-1/2 z-10 -ml-[150px] w-[300px] [transform-origin:50%_100%] sm:-ml-[170px] sm:w-[340px]"
      >
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
          <RoleDeck />
        </motion.div>
      </motion.div>
    </div>
  );
}
