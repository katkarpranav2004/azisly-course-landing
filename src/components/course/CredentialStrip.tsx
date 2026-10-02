"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useInView, useReducedMotion } from "framer-motion";
import { Globe2, Users } from "lucide-react";
import { experts } from "@/content/corporate-launch";
import { useStudio } from "./StudioContext";

const STEP_MS = 2400;

/** Square tile beside each credential: the institution's logo, or an icon where there is none. */
function LogoTile({ logo, icon, on }: { logo?: string; icon?: "years" | "globe"; on: boolean }) {
  const found = logo ? experts.founderLogos.find((l) => l.name === logo) : undefined;
  const Icon = icon === "globe" ? Globe2 : Users;
  return (
    <span
      className={`flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-2xl border bg-white transition-[border-color,box-shadow,transform] duration-300 ${
        on ? "-translate-y-0.5 border-accent/40 shadow-[0_10px_22px_-12px_rgba(86,36,208,.55)]" : "border-[#e6e4f0] shadow-[0_6px_16px_-12px_rgba(40,30,100,.35)]"
      }`}
    >
      {found ? (
        <Image src={found.src} alt={found.name} width={Math.round((found.w / found.h) * 40)} height={40} className="h-10 w-auto max-w-[44px] object-contain" />
      ) : (
        <Icon size={26} strokeWidth={1.6} className={`transition-colors duration-300 ${on ? "text-accent" : "text-[#6b6f78]"}`} />
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
      <ul ref={ref} className="mx-auto grid max-w-[1240px] grid-cols-1 gap-y-4 py-6 min-[520px]:grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 xl:gap-y-0">
        {items.map((c, i) => {
          const on = reduce || i === active;
          return (
            <li
              key={c.value}
              onMouseEnter={() => setActive(i)}
              className="flex min-w-0 items-center gap-3 xl:border-l xl:border-[#e6e4f0] xl:px-4 xl:first:border-l-0 xl:first:pl-0"
            >
              <LogoTile logo={c.logo} icon={c.icon} on={on} />
              <span className="min-w-0">
                <span className="relative inline-block font-[family-name:var(--font-serif)] text-[17px] font-bold leading-tight sm:text-[18px] xl:text-[15.5px]">
                  <span
                    aria-hidden
                    className={`absolute -inset-x-1 bottom-[0.04em] h-[0.48em] origin-left rounded-[3px] bg-[#6fd8b9]/55 transition-[transform,opacity] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
                      on ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                    }`}
                  />
                  <span className={`relative transition-colors duration-300 ${on ? "text-accent" : "text-foreground"}`}>{c.value}</span>
                </span>
                {c.label && <span className="mt-0.5 block text-[12.5px] leading-snug text-muted">{c.label}</span>}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
