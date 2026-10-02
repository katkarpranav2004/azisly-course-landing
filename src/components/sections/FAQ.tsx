"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import type { AudienceContent } from "@/content/types";

export default function FAQ({ content }: { content: AudienceContent }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="px-5 py-16 sm:py-24">
      <div className="mx-auto max-w-2xl">
        <SectionHeading eyebrow="FAQ" title="Questions you might have" />
        <Reveal delay={0.05}>
          <div className="card mt-10 divide-y divide-border">
            {content.faq.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={item.question}>
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-[15px] font-medium sm:text-base">{item.question}</span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-muted transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <p className="overflow-hidden px-6 text-sm leading-relaxed text-muted">
                      <span className="block pb-5">{item.answer}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
