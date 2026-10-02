import { Briefcase, Hammer, Layers, Wrench } from "lucide-react";
import Reveal from "@/components/Reveal";
import { course } from "@/content/course";

const ICONS = { framework: Layers, tools: Wrench, build: Hammer, career: Briefcase } as const;

export default function Leverage() {
  const { leverage } = course;
  return (
    <section id="outcomes" className="scroll-mt-6 px-5 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="display text-center text-[clamp(30px,4.4vw,50px)] leading-[1.05]">
            <span className="accent-text">{leverage.lead}</span> {leverage.accent}
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {leverage.items.map((item, i) => {
            const Icon = ICONS[item.icon as keyof typeof ICONS];
            return (
              <Reveal key={item.text} delay={i * 0.06}>
                <div className="card flex h-full items-start gap-4 p-6">
                  <span className="icon-chip h-11 w-11 shrink-0">
                    <Icon size={20} />
                  </span>
                  <p className="pt-1 text-[15.5px] leading-relaxed text-foreground/85">{item.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
