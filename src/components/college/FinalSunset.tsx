"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Check, ShieldCheck, Users } from "lucide-react";
import GlassClock from "@/components/clocks/GlassClock";
import MagneticButton from "@/components/launch/MagneticButton";
import OfferPrice from "@/components/launch/OfferPrice";
import Confetti from "./Confetti";
import { final } from "@/content/college-launch";
import type { AudienceContent } from "@/content/types";

export default function FinalSunset({ content, onEnroll }: { content: AudienceContent; onEnroll: () => void }) {
  const { pricing, closing } = content;
  const panelRef = useRef<HTMLDivElement>(null);
  const inView = useInView(panelRef, { once: true, margin: "-120px" });

  return (
    <section data-offer-zone="final" className="relative overflow-hidden px-5 py-20 sm:py-28">
      <div className="relative mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="display mx-auto max-w-3xl text-balance text-center text-[clamp(28px,4.4vw,52px)] leading-[1.06]"
        >
          {closing.lead} <span className="accent-text">{closing.accent}</span>
        </motion.h2>

        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: 40, rotate: -2, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
          className="featured relative mt-12"
        >
          <Confetti burst={inView ? 1 : 0} count={60} />
          <div className="featured-inner grid gap-10 p-6 sm:p-10 md:grid-cols-[1.1fr_.9fr] md:items-center">
            <div>
              <div className="flex items-center justify-between">
                <span className="badge">🎟️ Student launch pass</span>
                <span className="flex items-center gap-1.5 text-xs text-white/85">
                  <Users size={13} /> {pricing.seatsLeft} seats left
                </span>
              </div>
              <div className="mt-6">
                <OfferPrice pricing={pricing} size="xl" delay={0.1} variant="sunset" />
              </div>
              <p className="mt-3 text-[13px] text-white/85">One-time payment · lifetime access</p>
              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {final.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[14px]">
                    <Check size={16} className="mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-center rounded-3xl border border-white/30 bg-white/10 p-6 text-center">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em]">
                <span className="h-1.5 w-1.5 rounded-full bg-white [animation:soft-pulse_1s_infinite]" />
                Price goes up in
              </p>
              <div className="mt-4">
                <GlassClock endsAt={pricing.offerEndsAt} size="sm" />
              </div>
              <MagneticButton onClick={onEnroll} className="mt-7 w-full">
                Grab my seat <ArrowRight size={17} />
              </MagneticButton>
              <p className="mt-3 flex items-center gap-1.5 text-[11.5px] text-white/80">
                <ShieldCheck size={12} /> Secure checkout powered by Cashfree
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
