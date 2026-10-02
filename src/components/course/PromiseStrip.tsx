import { Hammer, Infinity as InfinityIcon, Receipt } from "lucide-react";
import Reveal from "@/components/Reveal";
import { course } from "@/content/course";

const ICONS = [Receipt, Hammer, InfinityIcon];

export default function PromiseStrip() {
  return (
    <section className="px-5 pb-20 sm:pb-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="display text-center text-[clamp(30px,4.4vw,50px)] leading-[1.05]">
            The Azisly <span className="accent-text">promise</span>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {course.promise.map((p, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <Reveal key={p.title} delay={i * 0.06}>
                <div className="card h-full p-6">
                  <span className="icon-chip h-11 w-11">
                    <Icon size={20} />
                  </span>
                  <p className="mt-5 text-[17px] font-bold">{p.title}</p>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{p.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
