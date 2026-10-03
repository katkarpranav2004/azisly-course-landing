"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import RingClock from "@/components/clocks/RingClock";
import MagneticButton from "@/components/launch/MagneticButton";
import type { PricingConfig } from "@/content/types";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

/** One stop on the trail: a glowing dot on the dotted path, a small label, then the content. */
function Stop({ label, delay, last, children }: { label: string; delay: number; last?: boolean; children: ReactNode }) {
  return (
    <motion.div {...rise(delay)} className={`relative pl-9 ${last ? "" : "pb-6"}`}>
      <span aria-hidden className="absolute left-0 top-[2px] h-[14px] w-[14px] rounded-full bg-white shadow-[0_0_0_5px_rgba(255,255,255,.28),0_0_18px_rgba(255,255,255,.9)]" />
      {!last && <span aria-hidden className="absolute -bottom-[2px] left-[6px] top-[24px] border-l-2 border-dashed border-white/55" />}
      <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.26em] text-white/90">{label}</p>
      {children}
    </motion.div>
  );
}

/**
 * The offer on the college hero: no box, a dotted path with three stops (the price, the countdown, the seat).
 * The discount is a round seal that sits on the price like a stamp.
 */
export default function OfferTrail({ pricing, onEnroll }: { pricing: PricingConfig; onEnroll: () => void }) {
  const reduce = useReducedMotion();
  const off = Math.round((1 - pricing.offerPrice / pricing.listPrice) * 100);

  return (
    <div className="relative mt-7 max-w-[600px]">
      <Stop label="Launch price" delay={0.2}>
        <div className="flex items-center gap-x-1 sm:gap-x-3">
          <motion.span
            className="display relative block font-[family-name:var(--font-unbounded)] text-[clamp(40px,11vw,60px)] leading-[0.95] text-white [text-shadow:0_0_40px_rgba(255,255,255,.55)]"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: [0.8, 1.06, 1], filter: "blur(0px)" }}
            transition={{ delay: 0.5, duration: 0.8, times: [0, 0.6, 1], ease: [0.22, 1, 0.36, 1] }}
          >
            {inr(pricing.offerPrice)}
          </motion.span>

          {/* the discount seal: a round stamp with a slowly turning dashed ring */}
          <motion.span
            className="relative -mt-4 grid h-[62px] w-[62px] shrink-0 -rotate-[10deg] place-items-center rounded-full bg-white text-center font-[family-name:var(--font-unbounded)] text-[#c2185b] shadow-[0_16px_30px_-12px_rgba(60,0,60,.5)] sm:h-[78px] sm:w-[78px]"
            initial={{ scale: 0, rotate: -40 }}
            animate={{ scale: [0, 1.25, 1], rotate: -10 }}
            transition={{ delay: 1.0, duration: 0.55, ease: "backOut" }}
          >
            <motion.span
              aria-hidden
              className="absolute inset-[4px] rounded-full border-2 border-dashed border-[#c2185b]/45"
              animate={reduce ? undefined : { rotate: 360 }}
              transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
            />
            <span className="relative leading-none">
              <b className="block text-[19px] sm:text-[24px]">{off}%</b>
              <i className="mt-0.5 block text-[9px] font-bold not-italic tracking-[0.2em] sm:text-[10.5px]">OFF</i>
            </span>
          </motion.span>
        </div>

        <p className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-white/85">
          <span className="relative text-[17px]">
            {inr(pricing.listPrice)}
            <motion.span
              aria-hidden
              className="absolute left-[-4%] top-1/2 h-[2px] w-[108%] origin-left -rotate-6 rounded bg-white"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.9, duration: 0.35, ease: "easeOut" }}
            />
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.14em]">incl. GST</span>
        </p>
      </Stop>

      <Stop label="Offer ends in" delay={0.3}>
        <RingClock endsAt={pricing.offerEndsAt} />
      </Stop>

      <Stop label="Your seat" delay={0.4} last>
        {/* One column, one width: the seat line, the button and the checkout line all centre on the same axis. */}
        <div className="flex max-w-[300px] flex-col items-stretch gap-2.5">
          <span className="flex items-center justify-center gap-2 text-[12.5px] font-semibold text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_#fff] [animation:soft-pulse_1.2s_infinite]" />
            Student launch offer · {pricing.seatsLeft} seats left
          </span>
          <MagneticButton onClick={onEnroll} className="w-full">
            Grab my seat <ArrowRight size={16} />
          </MagneticButton>
          <span className="flex items-center justify-center gap-1.5 text-[11px] text-white/80">
            <ShieldCheck size={12} /> Secure checkout · Cashfree
          </span>
        </div>
      </Stop>
    </div>
  );
}
