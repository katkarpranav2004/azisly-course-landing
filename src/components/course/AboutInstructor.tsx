import Image from "next/image";
import Reveal from "@/components/Reveal";
import { experts } from "@/content/corporate-launch";
import { course } from "@/content/course";
import type { Faculty } from "@/content/types";

export default function AboutInstructor({ faculty }: { faculty: Faculty }) {
  const { founder, mentors } = faculty;

  return (
    <section id="instructor" className="scroll-mt-6 px-3 pb-20 sm:px-5 sm:pb-24">
      <div className="panel-deep relative mx-auto max-w-6xl overflow-hidden rounded-[32px] px-5 py-16 text-white sm:px-10 sm:py-20">
        <div aria-hidden className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#5b5ff0]/30 blur-[100px]" />
        <Reveal>
          <h2 className="display text-center text-[clamp(30px,4.4vw,50px)] leading-[1.05]">
            About the <span className="text-[var(--soft-accent)]">instructor</span>
          </h2>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="relative mx-auto mt-12 grid max-w-4xl grid-cols-[minmax(0,1fr)] gap-8 rounded-[24px] border border-white/15 bg-white/[0.06] p-5 backdrop-blur sm:p-8 md:grid-cols-[260px_1fr]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] bg-[#0d1236]">
              <Image src={founder.photo} alt={founder.name} fill sizes="260px" className="object-cover object-[50%_20%]" />
            </div>
            <div>
              <p className="display text-[28px] leading-tight">{founder.name}</p>
              <p className="mt-1 text-[14px] text-white/70">{founder.role} · Instructor</p>
              <p className="mt-1 text-[13.5px] text-[var(--soft-accent)]">{founder.credentials}</p>
              {course.instructorBio.map((p) => (
                <p key={p} className="mt-4 text-[15px] leading-relaxed text-white/85">
                  {p}
                </p>
              ))}
              <ul className="mt-6 flex flex-wrap gap-2">
                {experts.founderLogos.map((l) => (
                  <li key={l.name} title={l.name} className="flex h-11 items-center rounded-lg bg-white px-3">
                    <Image src={l.src} alt={l.name} width={Math.round((l.w / l.h) * 24)} height={24} className="h-6 w-auto" />
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-2">
                {founder.stats.map((s) => (
                  <span key={s.label} className="rounded-full border border-white/20 px-3 py-1.5 text-[12.5px]">
                    <b>{s.value}</b> <span className="text-white/70">{s.label.toLowerCase()}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <p className="mt-12 text-center text-[11.5px] font-semibold uppercase tracking-[0.26em] text-white/60">Program mentors</p>
        <div className="mx-auto mt-5 grid max-w-4xl gap-4 sm:grid-cols-2">
          {mentors.map((m) => (
            <div key={m.name} className="flex items-center gap-4 rounded-[20px] border border-white/15 bg-white/[0.05] p-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                <Image src={m.photo} alt={m.name} fill sizes="64px" className="scale-[1.06] object-cover object-[50%_25%]" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold">{m.name}</p>
                <p className="text-[13px] text-white/70">{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
