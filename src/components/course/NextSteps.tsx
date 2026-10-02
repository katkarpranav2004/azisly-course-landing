"use client";

import Reveal from "@/components/Reveal";
import { useStudio } from "./StudioContext";

/** "What happens after you pay": removes the post-payment uncertainty right after the price. */
export default function NextSteps() {
  const { nextSteps } = useStudio().copy;
  return (
    <section className="px-5 pb-20 sm:pb-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="display text-center text-[clamp(28px,4vw,44px)] leading-[1.05]">
            What happens <span className="accent-text">after you pay</span>
          </h2>
        </Reveal>
        <div className="relative mt-10 grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-4">
          <span aria-hidden className="absolute left-[10%] right-[10%] top-5 hidden h-px bg-border md:block" />
          {nextSteps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <div className="relative flex gap-4 md:flex-col md:gap-0 md:text-center">
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-[14px] font-bold text-white md:mx-auto">
                  {i + 1}
                </span>
                <div className="md:mt-4">
                  <p className="text-[16px] font-bold">{s.title}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-muted">{s.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
