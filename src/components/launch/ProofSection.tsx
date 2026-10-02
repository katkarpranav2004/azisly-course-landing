"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { SHOW_SAMPLES, type Testimonial } from "@/content/corporate-launch";
import { focusStyle } from "@/lib/avatarFocus";

const AVATAR_GRADIENTS = [
  "from-[#6366f1] to-[#22d3ee]",
  "from-[#8b5cf6] to-[#ec4899]",
  "from-[#10b981] to-[#22d3ee]",
  "from-[#3b82f6] to-[#8b5cf6]",
];

function Card({ t, i }: { t: Testimonial; i: number }) {
  return (
    <figure className="relative mx-2 w-[300px] shrink-0 rounded-3xl border border-white bg-white/80 p-5 text-[#141a3a] shadow-[0_20px_50px_-24px_rgba(70,80,160,.45)] backdrop-blur sm:w-[340px]">
      <Quote size={18} className="text-[#7c83f5]" />
      <blockquote className="mt-3 text-[15px] leading-relaxed text-[#2a3160]">“{t.quote}”</blockquote>
      <figcaption className="mt-4 flex items-center gap-3">
        <span
          className={`relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br text-[14px] font-bold text-white ring-2 ring-white shadow-[0_0_0_3px_rgba(124,131,245,.25)] ${
            AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]
          }`}
        >
          {t.photo ? (
            <Image src={t.photo} alt={t.name} fill sizes="96px" className="object-cover" style={{ objectPosition: "50% 25%", ...focusStyle(t) }} />
          ) : (
            t.name.charAt(0)
          )}
        </span>
        <span>
          <span className="block text-[13.5px] font-semibold">{t.name}</span>
          {t.role && <span className="block text-[12px] text-[#6b72a6]">{t.role}</span>}
        </span>
      </figcaption>
    </figure>
  );
}

export default function ProofSection({
  eyebrow,
  heading,
  testimonials,
}: {
  eyebrow: string;
  heading: string;
  testimonials: Testimonial[];
}) {
  const items = testimonials.filter((t) => SHOW_SAMPLES || !t.sample);
  if (items.length === 0) return null;

  const half = Math.ceil(items.length / 2);
  const rows = [items.slice(0, half), items.slice(half)].filter((r) => r.length);

  return (
    <section data-offer-zone="proof" className="px-3 py-6 sm:px-5 sm:py-10">
      <div className="relative overflow-hidden rounded-[36px] bg-[linear-gradient(160deg,#eef1ff_0%,#f4f0ff_45%,#e9fbf6_100%)] py-16 sm:py-20">
        <div aria-hidden className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#c7d2fe] blur-[100px]" />
        <div aria-hidden className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#a7f3d0]/70 blur-[100px]" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative px-5 text-center"
        >
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.3em] text-[#5b62c9]">{eyebrow}</p>
          <h2 className="display mt-3 text-[clamp(30px,4.4vw,54px)] leading-none text-[#0f1433]">{heading}</h2>
        </motion.div>

        <div className="marquee relative mt-10 flex flex-col gap-4 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          {rows.map((row, r) => (
            <div key={r} className="overflow-hidden">
              <div
                className={`marquee-track ${r % 2 ? "reverse" : ""}`}
                style={{ ["--marquee-duration" as string]: `${50 + r * 12}s` }}
              >
                {[...row, ...row, ...row, ...row].map((t, i) => (
                  <Card key={`${r}-${i}`} t={t} i={i + r} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
