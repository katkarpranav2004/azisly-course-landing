"use client";

import { ArrowRight } from "lucide-react";
import { useCountdown } from "@/lib/useCountdown";
import type { PricingConfig } from "@/content/types";

const pad = (n: number) => String(n).padStart(2, "0");
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/**
 * The page's one persistent CTA. It never moves: bottom-right card on desktop (the top-right is the
 * level chip), full-width bar on phones. Yellow on the dark card is the only yellow button on the page
 * chrome, so it reads on the pink, purple and white sections alike.
 */
export default function StickyEnroll({ pricing, onEnroll, hidden }: { pricing: PricingConfig; onEnroll: () => void; hidden: boolean }) {
  const left = useCountdown(pricing.offerEndsAt);
  const off = Math.round((1 - pricing.offerPrice / pricing.listPrice) * 100);
  if (hidden) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 sm:inset-x-auto sm:bottom-6 sm:right-6">
      <div className="flex items-center justify-between gap-2 rounded-2xl border border-white/25 bg-[#1a0a2e]/95 py-2.5 pl-3 pr-2.5 min-[350px]:gap-3 min-[350px]:pl-4 shadow-[0_20px_50px_-12px_rgba(20,0,40,.75)] backdrop-blur-md sm:gap-4">
        <div className="min-w-0 leading-tight">
          <div className="flex items-center gap-x-2">
            <span className="whitespace-nowrap font-[family-name:var(--font-unbounded)] text-[17px] font-extrabold text-white min-[350px]:text-[18px]">{inr(pricing.offerPrice)}</span>
            <span className="hidden text-[12px] text-white/55 line-through min-[400px]:inline">{inr(pricing.listPrice)}</span>
            <span className="hidden whitespace-nowrap rounded-md bg-[#ff2e63] px-1.5 py-0.5 text-[10.5px] font-extrabold text-white min-[350px]:inline-block">{off}% OFF</span>
          </div>
          <p className="mt-1 whitespace-nowrap font-mono text-[10.5px] tabular-nums text-[#ffd23f] min-[350px]:text-[11.5px]">
            {left ? `Ends in ${left.days}d ${pad(left.hours)}:${pad(left.minutes)}:${pad(left.seconds)}` : "Ends soon"}
          </p>
        </div>

        <span className="relative shrink-0">
          <span aria-hidden className="absolute -inset-1 rounded-[14px] bg-[#ffd23f] opacity-40 motion-safe:animate-ping" />
          <button
            type="button"
            onClick={onEnroll}
            className="relative flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-gradient-to-b from-[#ffe066] to-[#ffc21a] px-3 py-3 font-[family-name:var(--font-unbounded)] text-[12px] min-[350px]:gap-2 min-[350px]:px-4 min-[350px]:text-[13px] font-extrabold text-[#1a0a2e] shadow-[inset_0_-2px_0_rgba(0,0,0,.18)] transition hover:brightness-105 active:scale-[0.97]"
          >
            Grab my seat <ArrowRight size={15} />
          </button>
        </span>
      </div>
    </div>
  );
}
