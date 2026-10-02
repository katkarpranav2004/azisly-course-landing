"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, ShieldCheck, Users } from "lucide-react";
import FlipClock from "@/components/clocks/FlipClock";
import MagneticButton from "./MagneticButton";
import OfferPrice from "./OfferPrice";
import { final } from "@/content/corporate-launch";
import type { AudienceContent } from "@/content/types";

export default function FinalOffer({ content, onEnroll }: { content: AudienceContent; onEnroll: () => void }) {
  const { pricing, closing } = content;

  return (
    <section
      data-offer-zone="final"
      className="relative overflow-hidden px-5 py-20 sm:py-28"
      style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, #3b1a8f 0%, #16134a 40%, #050816 80%)" }}
    >
      <div aria-hidden className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-[#3b6bff]/30 blur-[140px]" />
      <div aria-hidden className="absolute bottom-10 right-1/4 h-96 w-96 rounded-full bg-[#e44fd6]/20 blur-[140px]" />

      <div className="relative mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="display mx-auto max-w-3xl text-balance text-center text-[clamp(30px,4.6vw,56px)] leading-[1.04]"
        >
          {closing.lead} <span className="accent-text">{closing.accent}</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="featured mt-12"
        >
          <div className="featured-inner grid gap-10 p-6 sm:p-10 md:grid-cols-[1.1fr_.9fr] md:items-center">
            <div>
              <div className="flex items-center justify-between">
                <span className="badge">Launch pricing</span>
                <span className="flex items-center gap-1.5 text-xs text-muted">
                  <Users size={13} /> {pricing.seatsLeft} seats left
                </span>
              </div>
              <div className="mt-6">
                <OfferPrice pricing={pricing} size="xl" delay={0.1} />
              </div>
              <p className="mt-3 text-[13px] text-muted">One-time payment · lifetime access</p>
              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {final.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[14px] text-white/85">
                    <Check size={16} className="mt-0.5 shrink-0 text-[#34d399]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-center rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center">
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#ff8fa3]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff2e63] [animation:soft-pulse_1s_infinite]" />
                Price goes up in
              </p>
              <div className="mt-4">
                <FlipClock endsAt={pricing.offerEndsAt} size="sm" />
              </div>
              <MagneticButton onClick={onEnroll} className="mt-7 w-full py-4 text-[16px]">
                Join AI Corporate Analyst <ArrowRight size={18} />
              </MagneticButton>
              <p className="mt-3 flex items-center gap-1.5 text-[11.5px] text-muted">
                <ShieldCheck size={12} /> Secure checkout powered by Cashfree
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
