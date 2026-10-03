"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Users } from "lucide-react";
import GlassClock from "@/components/clocks/GlassClock";
import MagneticButton from "@/components/launch/MagneticButton";
import OfferPrice from "@/components/launch/OfferPrice";
import DuoComposition from "./DuoComposition";
import { hero } from "@/content/college-launch";
import { reach } from "@/content/shared";
import type { PricingConfig } from "@/content/types";

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function HeroCollege({ pricing, onEnroll }: { pricing: PricingConfig; onEnroll: () => void }) {
  return (
    <section data-offer-zone="hero" className="relative overflow-hidden px-5 pb-14 sm:pb-16">
      <div aria-hidden className="absolute -right-[20vmax] -top-[30vmax] h-[70vmax] w-[70vmax] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.35),transparent_60%)] blur-2xl" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between py-4">
        {/* White logo on a transparent background, made for the coloured hero. */}
        <Image
          src="/logos/azisly-white.svg"
          alt="Azisly.ai"
          width={2788}
          height={937}
          unoptimized
          priority
          className="h-[34px] w-auto drop-shadow-[0_4px_14px_rgba(60,0,60,.35)] sm:h-[40px]"
        />
      </header>

      <div className="relative z-10 mx-auto mt-4 grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-8 lg:mt-6 lg:grid-cols-[1.05fr_.95fr] lg:gap-6">
        <div>
          <motion.p {...rise(0)} className="eyebrow text-white/90">
            {hero.eyebrow}
          </motion.p>
          <motion.h1
            {...rise(0.05)}
            className="display mt-3 text-[clamp(36px,4.6vw,62px)] leading-[1.02] [text-shadow:0_10px_40px_rgba(80,0,60,.25)]"
          >
            {hero.headline} <span className="accent-text">{hero.headlineAccent}</span>
          </motion.h1>
          <motion.p {...rise(0.1)} className="mt-4 max-w-[520px] text-[15.5px] leading-relaxed text-white/90 sm:text-[17px]">
            {hero.sub}
          </motion.p>
          <motion.p {...rise(0.14)} className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-3.5 py-1.5 text-[13px] font-semibold backdrop-blur-md">
            <Users size={14} /> {reach.college}
          </motion.p>

          <motion.div {...rise(0.18)} className="card relative mt-6 max-w-[560px] rounded-[28px] p-5">
            <OfferPrice pricing={pricing} size="lg" delay={0.5} variant="sunset" />
            <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-white/90">
                  <span className="h-1.5 w-1.5 rounded-full bg-white [animation:soft-pulse_1s_infinite]" />
                  Offer ends in
                </p>
                <GlassClock endsAt={pricing.offerEndsAt} size="sm" />
              </div>
              {/* One column, one width: the badge, the button and the checkout line all centre on the same axis. */}
              <div className="flex flex-col items-stretch gap-2 sm:w-[250px]">
                <span className="badge justify-center whitespace-nowrap px-3 py-1.5 text-[11.5px]">
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
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <DuoComposition />
        </motion.div>
      </div>
    </section>
  );
}
