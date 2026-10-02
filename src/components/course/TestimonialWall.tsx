"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { SHOW_SAMPLES, type Testimonial } from "@/content/corporate-launch";
import { focusStyle, initials } from "@/lib/avatarFocus";
import { useStudio } from "./StudioContext";

function Card({ t, i }: { t: Testimonial; i: number }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: (i % 5) * 0.06 }}
      whileHover={{ y: -4 }}
      className="card relative flex h-full flex-col p-5"
    >
      {t.video ? (
        <video src={t.video} controls playsInline preload="none" className="mb-3 aspect-video w-full rounded-lg bg-black object-cover" />
      ) : (
        <Quote size={16} className="text-accent" />
      )}
      <blockquote className="mt-3 flex-1 text-[14.5px] leading-relaxed">{t.quote}</blockquote>
      <figcaption className="mt-4 flex items-center gap-3">
        <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f3efff] text-[15px] font-bold text-accent ring-2 ring-white shadow-[0_0_0_3px_#e9e2ff]">
          {t.photo ? (
            <Image
              src={t.photo}
              alt={t.name}
              fill
              sizes="112px"
              className="object-cover"
              style={{ objectPosition: "50% 25%", ...focusStyle(t) }}
            />
          ) : (
            initials(t.name)
          )}
        </span>
        <span className="min-w-0">
          <span className="block text-[14px] font-semibold">{t.name}</span>
          {t.role && <span className="block text-[12px] text-muted">{t.role}</span>}
        </span>
      </figcaption>
    </motion.figure>
  );
}

export default function TestimonialWall() {
  const items = useStudio().copy.testimonials.filter((t) => SHOW_SAMPLES || !t.sample);
  if (items.length === 0) return null;
  const top = items.slice(0, 3);
  const bottom = items.slice(3, 8);

  return (
    <section id="testimonials" className="scroll-mt-6 px-5 pb-20 sm:pb-24">
      <div className="mx-auto max-w-6xl rounded-[28px] border border-border bg-[#f7f9fa] p-5 sm:p-8">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_1fr]">
          <div className="flex flex-col justify-center p-2 md:col-span-2 lg:col-span-1">
            <h2 className="display text-[clamp(30px,3.2vw,42px)] leading-[1.05]">Testimonials</h2>
            <p className="mt-3 text-[14.5px] text-muted">What learners say after building with AI.</p>
          </div>
          {top.map((t, i) => (
            <Card key={`t-${i}`} t={t} i={i} />
          ))}
        </div>
        {bottom.length > 0 && (
          <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {bottom.map((t, i) => (
              <Card key={`b-${i}`} t={t} i={i + 3} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
