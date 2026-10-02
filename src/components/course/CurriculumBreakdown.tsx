"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown, Clock, Hammer } from "lucide-react";
import Reveal from "@/components/Reveal";
import { course } from "@/content/course";
import type { AudienceContent } from "@/content/types";

export default function CurriculumBreakdown({ content, onEnroll }: { content: AudienceContent; onEnroll: () => void }) {
  const [open, setOpen] = useState(0);
  const { founder } = content.faculty;

  return (
    <section id="curriculum" className="scroll-mt-6 px-5 pb-20 sm:pb-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="display text-center text-[clamp(30px,4.4vw,50px)] leading-[1.05]">
            Curriculum <span className="accent-text">breakdown</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <div className="flex flex-col gap-3">
            {content.curriculum.map((m, i) => {
              const isOpen = open === i;
              return (
                <div key={m.index} className={`card overflow-hidden transition-colors ${isOpen ? "bg-surface-2" : ""}`}>
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-3 px-5 py-4 text-left"
                  >
                    <ChevronDown size={18} className={`shrink-0 text-muted transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                    <span className="flex-1 text-[15.5px] font-semibold">{m.title}</span>
                    {m.tag && (
                      <span className="hidden items-center gap-1 rounded-full bg-[#fff6d6] px-2 py-0.5 text-[11px] font-semibold text-[#8a6100] sm:flex">
                        <Hammer size={11} />
                        {m.tag}
                      </span>
                    )}
                    <span className="badge shrink-0 px-2.5 py-1 text-[11px]">Module {String(m.index).padStart(2, "0")}</span>
                  </button>
                  <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <div className="px-5 pb-5 pl-[52px]">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">{m.stage}</p>
                        <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{m.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-5 lg:sticky lg:top-6">
            <div className="relative aspect-video overflow-hidden rounded-[22px] bg-[#0d1236]">
              <Image src={founder.photo} alt={founder.name} fill sizes="(min-width: 1024px) 460px, 100vw" className="object-cover object-[70%_20%]" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,16,51,.85),transparent_70%)]" />
              <div className="absolute bottom-5 left-5 text-white">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">Your instructor</p>
                <p className="display mt-1 text-2xl">{founder.name}</p>
                <p className="text-[13px] text-white/75">{founder.role}</p>
              </div>
            </div>
            <div className="panel-accent rounded-[22px] p-6 text-white shadow-[0_24px_50px_-24px_rgba(40,20,120,.6)]">
              <p className="text-[17px] font-bold">Course summary</p>
              <p className="mt-2 text-[14.5px] leading-relaxed text-white/85">{course.summary}</p>
              <p className="mt-4 flex items-center gap-2 text-[13px] text-white/80">
                <Clock size={14} /> 13 live sessions · 30 to 60 min each
              </p>
              <button
                onClick={onEnroll}
                className="mt-5 w-full rounded-xl bg-white py-3 text-[14.5px] font-semibold text-[var(--panel-ink)] transition hover:bg-white/90"
              >
                Enroll for ₹{content.pricing.offerPrice.toLocaleString("en-IN")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
