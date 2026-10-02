"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useInView, useReducedMotion } from "framer-motion";
import { Briefcase, Globe2 } from "lucide-react";
import { experts } from "@/content/corporate-launch";
import { useStudio } from "./StudioContext";

const STEP_MS = 2400;

/** Square tile above each credential: the institution's logo, or an icon where there is none. */
function LogoTile({ logo, icon, on }: { logo?: string; icon?: "years" | "globe"; on: boolean }) {
  const found = logo ? experts.founderLogos.find((l) => l.name === logo) : undefined;
  const Icon = icon === "globe" ? Globe2 : Briefcase;
  return (
    <span
      className={`mb-2.5 flex h-12 w-12 items-center justify-center rounded-xl border bg-white transition-[border-color,box-shadow,transform] duration-300 ${
        on ? "-translate-y-0.5 border-accent/40 shadow-[0_10px_22px_-12px_rgba(86,36,208,.55)]" : "border-border shadow-none"
      }`}
    >
      {found ? (
        <Image src={found.src} alt={found.name} width={Math.round((found.w / found.h) * 28)} height={28} className="h-7 w-auto max-w-[34px] object-contain" />
      ) : (
        <Icon size={22} strokeWidth={1.9} className={`transition-colors duration-300 ${on ? "text-accent" : "text-[#5e6266]"}`} />
      )}
    </span>
  );
}

/**
 * Prasun's credentials directly under the hero: the first trust marker after the fold.
 * While on screen, a highlighter moves from one credential to the next so each name gets its moment.
 * Plain CSS transitions, so the resting state is always correct even if a frame is skipped.
 */
export default function CredentialStrip() {
  const ref = useRef<HTMLUListElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const items = useStudio().copy.credentials;

  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(() => setActive((a) => (a + 1) % items.length), STEP_MS);
    return () => clearInterval(id);
  }, [inView, reduce, items.length]);

  return (
    <section aria-label="Instructor credentials" className="border-b border-border bg-white px-5">
      <ul ref={ref} className="mx-auto grid max-w-6xl grid-cols-2 gap-x-5 gap-y-5 py-6 sm:grid-cols-3 xl:grid-cols-5 xl:gap-x-7">
        {items.map((c, i) => {
          const on = reduce || i === active;
          return (
            <li
              key={c.value}
              onMouseEnter={() => setActive(i)}
              className={`relative min-w-0 pl-3.5 ${i === items.length - 1 ? "col-span-2 sm:col-span-1" : ""}`}
            >
              <span
                aria-hidden
                className={`absolute bottom-0 left-0 top-0 w-[3px] rounded-full transition-colors duration-300 ${on ? "bg-[#5624d0]" : "bg-[rgba(86,36,208,.22)]"}`}
              />
              <LogoTile logo={c.logo} icon={c.icon} on={on} />
              <p className="relative inline-block font-[family-name:var(--font-serif)] text-[17px] font-bold leading-tight sm:text-[19px] xl:whitespace-nowrap xl:text-[16.5px]">
                <span
                  aria-hidden
                  className={`absolute -inset-x-1 bottom-[0.04em] h-[0.48em] origin-left rounded-[3px] bg-[#6fd8b9]/55 transition-[transform,opacity] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
                    on ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                  }`}
                />
                <span className={`relative transition-colors duration-300 ${on ? "text-accent" : "text-foreground"}`}>{c.value}</span>
              </p>
              {c.label && <p className="mt-0.5 text-[12.5px] text-muted">{c.label}</p>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
