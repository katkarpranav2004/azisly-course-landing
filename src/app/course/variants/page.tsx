import type { Metadata } from "next";
import type { ComponentType } from "react";
import ThemeShell from "@/components/ThemeShell";
import PainTactile from "@/components/course/variants/PainTactile";
import PainKinetic from "@/components/course/variants/PainKinetic";
import PainEditorial from "@/components/course/variants/PainEditorial";
import WhyTactile from "@/components/course/variants/WhyTactile";
import WhyKinetic from "@/components/course/variants/WhyKinetic";
import WhyEditorial from "@/components/course/variants/WhyEditorial";

export const metadata: Metadata = {
  title: "Design options | Azisly",
  robots: { index: false, follow: false },
};

type Option = { id: string; letter: string; angle: string; name: string; C: ComponentType };

const GROUPS: { title: string; options: Option[] }[] = [
  {
    title: "From stuck to sorted",
    options: [
      { id: "pain-a", letter: "A", angle: "Tactile", name: "Stuck notes, stamped sorted", C: PainTactile },
      { id: "pain-b", letter: "B", angle: "Kinetic", name: "Track Changes: the redlined work week", C: PainKinetic },
      { id: "pain-c", letter: "C", angle: "Editorial", name: "The Edit: your work week, marked up", C: PainEditorial },
    ],
  },
  {
    title: "Why this, not another course",
    options: [
      { id: "why-a", letter: "A", angle: "Tactile", name: "The proof desk", C: WhyTactile },
      { id: "why-b", letter: "B", angle: "Kinetic", name: "The studio console", C: WhyKinetic },
      { id: "why-c", letter: "C", angle: "Editorial", name: "By the numbers: 13, ₹461, 4", C: WhyEditorial },
    ],
  },
];

/**
 * Internal preview: every design option for the two sections, stacked so they can be compared.
 * `?only=pain-a` renders a single option (used for isolated screenshots).
 */
export default async function CourseVariantsPage({ searchParams }: { searchParams: Promise<{ only?: string }> }) {
  const { only } = await searchParams;
  const groups = only
    ? GROUPS.map((g) => ({ ...g, options: g.options.filter((o) => o.id === only) })).filter((g) => g.options.length > 0)
    : GROUPS;

  return (
    <ThemeShell theme="studio">
      <header className={`border-b border-border bg-white px-5 py-8 ${only ? "hidden" : ""}`}>
        <div className="mx-auto max-w-6xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-accent">Internal preview · not linked anywhere</p>
          <h1 className="display mt-2 text-[34px] leading-tight">Design options</h1>
          <div className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">
            {GROUPS.map((g) => (
              <div key={g.title}>
                <p className="text-[13px] font-semibold">{g.title}</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {g.options.map((o) => (
                    <li key={o.id}>
                      <a href={`#${o.id}`} className="inline-flex rounded-full border border-border px-3 py-1.5 text-[13px] hover:border-accent hover:text-accent">
                        {o.letter} · {o.angle}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {groups.map((g) =>
          g.options.map((o) => (
            <div key={o.id} id={o.id} data-variant={o.id} className="scroll-mt-0 border-b-8 border-[#eef0f3]">
              <div className="sticky top-0 z-30 bg-[#1c1d1f] px-5 py-2.5 text-white">
                <p className="mx-auto max-w-6xl text-[13px]">
                  <b>
                    {g.title} · Option {o.letter}
                  </b>
                  <span className="text-white/60">
                    {" "}
                    · {o.angle} · {o.name}
                  </span>
                </p>
              </div>
              <o.C />
            </div>
          ))
        )}
      </main>
    </ThemeShell>
  );
}
