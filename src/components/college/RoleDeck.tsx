"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { siApple, siGoogle, siIntel, siMeta, siNetflix, siNvidia, siSamsung, siUber, type SimpleIcon } from "simple-icons";
import { duo } from "@/content/college-launch";

/**
 * Example roles, not openings: each company is paired with generic analyst-style job titles that
 * commonly ask for data and AI skills. Nothing here claims hiring, partnership or endorsement
 * (see duo.disclaimer, which is always shown under the deck).
 */
const DECK: { icon: SimpleIcon; roles: string[] }[] = [
  { icon: siGoogle, roles: ["Business Analyst", "Product Analyst", "Data Analyst"] },
  { icon: siMeta, roles: ["Product Analyst", "Growth Analyst", "Marketing Analyst"] },
  { icon: siApple, roles: ["Business Analyst", "Operations Analyst", "Program Manager"] },
  { icon: siNetflix, roles: ["Content Analyst", "Marketing Analyst", "Data Analyst"] },
  { icon: siNvidia, roles: ["Business Ops Analyst", "Program Analyst", "Product Ops"] },
  { icon: siSamsung, roles: ["Strategy Analyst", "Marketing Analyst", "Product Planner"] },
  { icon: siIntel, roles: ["Business Analyst", "Supply Chain Analyst", "Program Manager"] },
  { icon: siUber, roles: ["Operations Analyst", "Business Analyst", "Growth Analyst"] },
];

const STEP_MS = 3400;

/** Brands with a near-black hex read better as ink than as a tint. */
const tint = (hex: string) => (hex === "000000" ? "#1c1d1f14" : `#${hex}1a`);

export default function RoleDeck() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % DECK.length), STEP_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <p className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/40 bg-white/15 px-3.5 py-1.5 font-[family-name:var(--font-unbounded)] text-[10px] font-extrabold uppercase tracking-[0.14em] text-white backdrop-blur-md">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#ffd23f] opacity-70 motion-safe:animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ffd23f]" />
        </span>
        {duo.rolesHeading}
      </p>

      {/* The deck: two card edges peek out behind the live card. All cards stay mounted and cross-fade with CSS, so a skipped frame can never leave the deck empty. */}
      <div className="relative mx-auto mt-3.5 h-[188px] w-full">
        <span aria-hidden className="absolute inset-x-5 bottom-0 top-3 -rotate-[2.5deg] rounded-[24px] bg-white/45 shadow-[0_20px_40px_-24px_rgba(40,0,60,.8)]" />
        <span aria-hidden className="absolute inset-x-2.5 bottom-0 top-1.5 rotate-[1.8deg] rounded-[24px] bg-white/70 shadow-[0_20px_40px_-24px_rgba(40,0,60,.8)]" />

        {DECK.map((d, k) => {
          const state = k === i ? "active" : k === (i - 1 + DECK.length) % DECK.length ? "leaving" : "waiting";
          const motion =
            state === "active"
              ? "translate-x-0 rotate-0 opacity-100"
              : state === "leaving"
                ? reduce
                  ? "opacity-0"
                  : "-translate-x-10 -rotate-6 opacity-0"
                : reduce
                  ? "opacity-0"
                  : "translate-x-8 rotate-3 opacity-0";
          return (
            <article
              key={d.icon.slug}
              aria-hidden={state !== "active"}
              className={`absolute inset-0 rounded-[24px] bg-white p-3.5 text-left text-[#1c1d1f] shadow-[0_26px_50px_-24px_rgba(40,0,60,.85)] transition-[transform,opacity] duration-[650ms] ease-[cubic-bezier(.22,1,.36,1)] ${motion}`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl" style={{ background: tint(d.icon.hex) }}>
                  <svg role="img" aria-label={d.icon.title} viewBox="0 0 24 24" className="h-[26px] w-[26px]" fill={`#${d.icon.hex}`}>
                    <path d={d.icon.path} />
                  </svg>
                </span>
                <span className="min-w-0 leading-tight">
                  <span className="block font-[family-name:var(--font-unbounded)] text-[15px] font-extrabold tracking-tight">{d.icon.title}</span>
                  <span className="block text-[11.5px] font-medium text-[#6b5a78]">Roles that ask for AI skills</span>
                </span>
              </div>

              <ul className="mt-3 flex flex-col gap-1.5">
                {d.roles.map((role, r) => (
                  <li
                    key={role}
                    className={`flex items-center gap-2 rounded-xl px-3 py-1 text-[12.5px] font-semibold transition-[transform,opacity] duration-500 ease-out ${
                      state === "active" || reduce ? "translate-x-0 opacity-100" : "translate-x-3 opacity-0"
                    }`}
                    style={{ background: tint(d.icon.hex), transitionDelay: state === "active" ? `${200 + r * 120}ms` : "0ms" }}
                  >
                    <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: d.icon.hex === "000000" ? "#1c1d1f" : `#${d.icon.hex}` }} />
                    {role}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-center gap-1.5" aria-hidden>
        {DECK.map((d, k) => (
          <span key={d.icon.slug} className={`h-1.5 rounded-full bg-white transition-all duration-300 ${k === i ? "w-5 opacity-100" : "w-1.5 opacity-45"}`} />
        ))}
      </div>

      <p className="mx-auto mt-2.5 max-w-[320px] text-center text-[9.5px] leading-snug text-white/75">{duo.disclaimer}</p>
    </div>
  );
}
