"use client";

import Image from "next/image";
import { Hammer } from "lucide-react";
import Reveal from "@/components/Reveal";
import { experts } from "@/content/corporate-launch";
import { MODULE_COUNT } from "@/content/shared";
import type { AudienceContent } from "@/content/types";

export default function MentorsModules({ content }: { content: AudienceContent }) {
  const { founder, mentors } = content.faculty;

  return (
    <section id="mentors" className="scroll-mt-6 px-5 pb-20 sm:pb-24">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-start gap-10 lg:grid-cols-[.9fr_1.1fr]">
        <div>
          <Reveal>
            <h2 className="display text-[clamp(30px,3.6vw,44px)] leading-[1.05]">Mentors</h2>
            <p className="mt-2 text-[14.5px] text-muted">Learn from people who have built and led with technology.</p>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="card mt-6 overflow-hidden">
              <div className="relative aspect-[16/10] bg-[#1c1d1f]">
                <Image src={founder.photo} alt={founder.name} fill sizes="(min-width: 1024px) 460px, 100vw" className="object-cover object-[50%_22%]" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-5 pb-4 pt-14 text-white">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#ff8fe0]">Lead instructor</p>
                  <p className="display mt-1 text-[24px]">{founder.name}</p>
                  <p className="text-[13px] text-white/80">{founder.role}</p>
                </div>
              </div>
              <div className="p-5">
                <p className="text-[13.5px] font-medium text-accent">{founder.credentials}</p>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{founder.bio[0]}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {experts.founderLogos.map((l) => (
                    <li key={l.name} title={l.name} className="flex h-9 items-center rounded-md border border-border bg-white px-2.5">
                      <Image src={l.src} alt={l.name} width={Math.round((l.w / l.h) * 20)} height={20} className="h-5 w-auto" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          <div className="mt-4 flex flex-col gap-3">
            {mentors.map((m, i) => (
              <Reveal key={m.name} delay={0.08 + i * 0.05}>
                <div className="card flex items-start gap-4 p-4">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                    <Image src={m.photo} alt={m.name} fill sizes="56px" className="scale-[1.06] object-cover object-[50%_25%]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{m.name}</p>
                    <p className="text-[13px] font-medium text-accent">{m.role}</p>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{m.bio[0]}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div>
          <Reveal>
            <h2 className="display text-[clamp(30px,3.6vw,44px)] leading-[1.05]">Modules</h2>
            <p className="mt-2 text-[14.5px] text-muted">
              {MODULE_COUNT} live sessions, from AI Curious to AI Corporate Analyst.
            </p>
          </Reveal>
          {/* All modules stay expanded: the CRO brief asks for no tabs or accordions hiding key info. */}
          <ol className="card mt-6 divide-y divide-border overflow-hidden">
            {content.curriculum.map((m) => (
              <li key={m.index} className="flex gap-3 px-4 py-3.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f3efff] font-mono text-[12.5px] font-bold text-accent">
                  {String(m.index).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="text-[15px] font-semibold">{m.title}</p>
                    {m.tag && (
                      <span className="flex items-center gap-1 rounded-full bg-[#fff6d6] px-2 py-0.5 text-[11px] font-semibold text-[#8a6100]">
                        <Hammer size={11} />
                        {m.tag}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-muted">{m.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
