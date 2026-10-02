"use client";

import { motion, useReducedMotion } from "framer-motion";
import { siApple, siGoogle, siIntel, siMeta, siNetflix, siNvidia, siSamsung, siUber, type SimpleIcon } from "simple-icons";

const BRANDS: SimpleIcon[] = [siGoogle, siMeta, siApple, siNetflix, siNvidia, siSamsung, siIntel, siUber];
const RADIUS = 118;

export default function BrandRing() {
  const reduce = useReducedMotion();

  return (
    <div className="relative h-[118px] [perspective:700px] [mask-image:linear-gradient(90deg,transparent,#000_18%,#000_82%,transparent)]">
      <motion.div
        className="absolute left-1/2 top-1/2 h-0 w-0 [transform-style:preserve-3d]"
        initial={{ rotateX: -8, rotateY: 0 }}
        animate={reduce ? undefined : { rotateY: -360 }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      >
        {BRANDS.map((b, i) => (
          <div
            key={b.slug}
            title={b.title}
            className="absolute -left-[30px] -top-[30px] flex h-[60px] w-[60px] items-center justify-center rounded-2xl bg-white shadow-[0_10px_24px_-10px_rgba(0,0,0,.6)] [backface-visibility:hidden]"
            style={{ transform: `rotateY(${(360 / BRANDS.length) * i}deg) translateZ(${RADIUS}px)` }}
          >
            <svg role="img" aria-label={b.title} viewBox="0 0 24 24" className="h-[30px] w-[30px]" fill={`#${b.hex}`}>
              <path d={b.path} />
            </svg>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
