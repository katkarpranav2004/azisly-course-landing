"use client";

import { motion } from "framer-motion";
import { pain, type PainLine } from "@/content/corporate-launch";

function Line({ line, i }: { line: PainLine; i: number }) {
  const [before, after] = line.text.split(line.hit);
  return (
    <motion.li
      initial={{ opacity: 0, x: -36, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group flex items-center gap-4 border-b border-[#ff4d6d]/15 py-4 last:border-0 sm:gap-6 sm:py-5"
    >
      <span className="text-[28px] transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-125 sm:text-[38px]">
        {line.emoji}
      </span>
      <p className="text-[clamp(19px,2.6vw,32px)] font-semibold leading-tight tracking-tight text-[#ffe4e8]/90">
        {before}
        <span className="text-[#ff4d6d] [text-shadow:0_0_24px_rgba(255,77,109,.45)]">{line.hit}</span>
        {after}
      </p>
    </motion.li>
  );
}

export default function PainSection() {
  return (
    <section
      data-offer-zone="pain"
      className="relative overflow-hidden px-5 py-20 sm:py-28"
      style={{
        background:
          "radial-gradient(ellipse 80% 55% at 50% 0%, #4a0d1c 0%, #1c0610 45%, #12040a 100%)",
      }}
    >
      <div aria-hidden className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#050816] to-transparent" />
      <div aria-hidden className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-[#ff1f4b]/10 blur-[120px]" />
      <div aria-hidden className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#b3123a]/15 blur-[120px]" />

      <div className="relative mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="eyebrow text-[#ff8fa3]">{pain.eyebrow}</p>
          <h2 className="display mt-3 text-[clamp(40px,6.4vw,84px)] leading-none text-white [text-shadow:0_0_60px_rgba(255,46,99,.35)]">
            {pain.heading}
          </h2>
          <p className="mt-4 text-[15px] text-[#ffb3c0]/70">If two of these hit home, keep scrolling.</p>
        </motion.div>

        <ul className="mt-10 sm:mt-14">
          {pain.lines.map((line, i) => (
            <Line key={line.text} line={line} i={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
