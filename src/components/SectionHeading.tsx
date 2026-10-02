import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: string;
}) {
  return (
    <Reveal className="flex flex-col items-center text-center">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="display mt-3 max-w-2xl text-balance text-[clamp(28px,4.2vw,46px)] leading-[1.04]">
        {title}
      </h2>
      {sub && <p className="mt-3 max-w-xl text-balance text-[15px] text-muted sm:text-base">{sub}</p>}
    </Reveal>
  );
}
