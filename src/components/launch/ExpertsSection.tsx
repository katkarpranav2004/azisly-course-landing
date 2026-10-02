"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { experts } from "@/content/corporate-launch";
import type { Faculty } from "@/content/types";

type Logo = { name: string; src: string; w: number; h: number };

function LogoTile({ logo, tall = false }: { logo: Logo; tall?: boolean }) {
  const h = tall ? 30 : 26;
  const w = Math.round((logo.w / logo.h) * h);
  return (
    <motion.li
      variants={{ hidden: { opacity: 0, y: 12, scale: 0.9 }, show: { opacity: 1, y: 0, scale: 1 } }}
      className="flex h-12 items-center justify-center rounded-xl bg-white px-3.5 shadow-[0_8px_24px_-12px_rgba(0,0,0,.6)]"
      title={logo.name}
    >
      <Image src={logo.src} alt={logo.name} width={w} height={h} className="h-auto max-h-[30px] w-auto" />
    </motion.li>
  );
}

const SURFACES = {
  launch: {
    section: "bg-[#070a14]",
    card: "bg-[linear-gradient(135deg,#0d1226,#090c18)]",
    fade: "from-[#090c18] md:to-[#0d1226]",
    accent: "text-[#a5b4ff]",
    glow: "bg-[#3b4bdc]/10",
    stage: "bg-[radial-gradient(ellipse_80%_60%_at_50%_30%,rgba(124,92,255,.35),transparent_70%),linear-gradient(170deg,#141a38,#0b0f22)]",
    squareA: "from-[#6f8bff] to-[#4b5cf0]",
    squareB: "from-[#7ee0d2] to-[#2bb5ff]",
  },
  sunset: {
    section: "bg-[#1c0828]",
    card: "bg-[linear-gradient(135deg,#2c0d40,#170622)]",
    fade: "from-[#170622] md:to-[#2c0d40]",
    accent: "text-[#ffb3d9]",
    glow: "bg-[#ff2e93]/15",
    stage: "bg-[radial-gradient(ellipse_80%_60%_at_50%_30%,rgba(255,79,216,.35),transparent_70%),linear-gradient(170deg,#3a1050,#1c0828)]",
    squareA: "from-[#9d6bff] to-[#6d3df5]",
    squareB: "from-[#ff8ad8] to-[#ff4fd8]",
  },
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } };

export default function ExpertsSection({
  faculty,
  variant = "launch",
}: {
  faculty: Faculty;
  variant?: keyof typeof SURFACES;
}) {
  const { founder, mentors } = faculty;
  const v = SURFACES[variant];

  return (
    <section data-offer-zone="experts" className={`relative overflow-hidden px-5 py-20 sm:py-28 ${v.section}`}>
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div aria-hidden className={`absolute left-1/2 top-0 h-72 w-[60%] -translate-x-1/2 rounded-full blur-[120px] ${v.glow}`} />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="eyebrow">{experts.eyebrow}</p>
          <h2 className="display mt-3 text-[clamp(32px,4.6vw,58px)] leading-none">{experts.heading}</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={`mt-12 grid overflow-hidden rounded-[28px] border border-white/[0.08] md:grid-cols-[340px_1fr] ${v.card}`}
        >
          {/* Cut-out portrait on a lit stage, with two squares tucked behind like the hero. */}
          <div className={`relative aspect-[4/5] overflow-hidden md:aspect-auto md:min-h-[460px] ${v.stage}`}>
            <span aria-hidden className={`absolute right-[8%] top-[10%] aspect-square w-[44%] rotate-6 rounded-[20px] bg-gradient-to-br shadow-[0_24px_50px_-24px_rgba(0,0,0,.6)] ${v.squareA}`} />
            <span aria-hidden className={`absolute bottom-[14%] left-[4%] aspect-square w-[38%] -rotate-[8deg] rounded-[20px] bg-gradient-to-br shadow-[0_24px_50px_-24px_rgba(0,0,0,.6)] ${v.squareB}`} />
            <Image
              src={experts.founderCutout}
              alt={founder.name}
              fill
              sizes="(min-width: 768px) 340px, 100vw"
              className="object-contain object-bottom drop-shadow-[0_20px_30px_rgba(0,0,0,.45)]"
            />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-10">
            <p className={`text-[13px] font-semibold uppercase tracking-[0.16em] ${v.accent}`}>
              {experts.founderCredential}
            </p>

            <motion.ul
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="mt-5 flex flex-wrap gap-2.5"
            >
              {experts.founderLogos.map((l) => (
                <LogoTile key={l.name} logo={l} />
              ))}
            </motion.ul>

            <h3 className="display mt-7 text-[clamp(32px,4vw,48px)] leading-none">{founder.name}</h3>
            <p className="mt-2 text-[15px] font-medium text-white/70">{founder.role}</p>
            <p className={`mt-2.5 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-1.5 text-[13.5px] font-semibold ${v.accent}`}>
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
              {experts.founderTitle}
            </p>
            <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-white/85">{experts.founderProof}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {founder.stats.map((s) => (
                <span key={s.label} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12.5px]">
                  <b className="font-bold text-white">{s.value}</b>{" "}
                  <span className="text-white/60">{s.label.toLowerCase()}</span>
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {mentors.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`flex gap-5 rounded-[24px] border border-white/[0.08] p-6 ${v.card}`}
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl">
                <Image src={m.photo} alt={m.name} fill sizes="96px" className="scale-[1.06] object-cover object-[50%_25%]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-[12px] font-semibold uppercase tracking-[0.14em] ${v.accent}`}>{m.role}</p>
                <h3 className="display mt-2 text-2xl">{m.name}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-white/65">{m.bio[0]}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
