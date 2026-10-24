"use client";

import { ArrowRight, Briefcase, Check, GraduationCap } from "lucide-react";
import Reveal from "@/components/Reveal";
import { audienceSplit } from "@/content/audience-split";

type Pick = "college" | "corporate";

const ICON = { college: GraduationCap, corporate: Briefcase } as const;
const TOP = { college: "#ff4f8b", corporate: "#5624d0" } as const;

/** Two cards that say why the same course fits students and working professionals, each with its own enrol button. */
export default function AudienceSplit({ onEnroll }: { onEnroll: (audience: Pick) => void }) {
  return (
    <section id="who" className="scroll-mt-20 px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="display text-center text-[clamp(30px,4.4vw,50px)] leading-[1.05]">
            Built for <span className="accent-text">{audienceSplit.accent}</span>
          </h2>
          <p className="mt-3 text-center text-[15.5px] text-muted">{audienceSplit.subtitle}</p>
        </Reveal>

        <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-2">
          {audienceSplit.cards.map((card, i) => {
            const Icon = ICON[card.audience];
            return (
              <Reveal key={card.audience} delay={0.05 + i * 0.08} className="h-full">
                <article
                  className="flex h-full flex-col rounded-[24px] border border-[#e6e4f0] bg-white p-7 shadow-[0_24px_60px_-40px_rgba(60,40,160,.45)] sm:p-9"
                  style={{ borderTop: `5px solid ${TOP[card.audience]}` }}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f1ecff] text-accent">
                      <Icon size={22} />
                    </span>
                    <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-muted">{card.label}</p>
                  </div>

                  <h3 className="display mt-5 text-[26px] leading-[1.15] sm:text-[30px]">{card.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{card.challenge}</p>

                  <ul className="mt-6 flex flex-col gap-3.5">
                    {card.reasons.map((r) => (
                      <li key={r} className="flex items-start gap-3 text-[15px] leading-snug">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--chip-bg)] text-accent">
                          <Check size={14} strokeWidth={3} />
                        </span>
                        {r}
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => onEnroll(card.audience)}
                    className="btn-primary mt-8 w-full py-3.5 text-[15px]"
                  >
                    {card.cta} <ArrowRight size={16} />
                  </button>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
