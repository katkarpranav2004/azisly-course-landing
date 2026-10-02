"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Quote } from "lucide-react";
import Reveal from "@/components/Reveal";
import { SHOW_SAMPLES } from "@/content/corporate-launch";
import { course } from "@/content/course";

export default function Learners() {
  const items = course.testimonials.filter((t) => SHOW_SAMPLES || !t.sample);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const id = setInterval(() => setI((v) => (v + 1) % items.length), 5000);
    return () => clearInterval(id);
  }, [items.length]);

  if (items.length === 0) return null;
  const t = items[i];

  return (
    <section className="px-5 pb-20 sm:pb-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="display text-center text-[clamp(30px,4.4vw,50px)] leading-[1.05]">
            From our <span className="accent-text">learners</span>
          </h2>
        </Reveal>

        <div className="panel-accent relative mt-12 overflow-hidden rounded-[26px] p-8 text-white sm:p-10">
          <div aria-hidden className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <Quote size={22} className="text-white/70" />
              <p className="display mt-4 max-w-3xl text-[clamp(20px,2.6vw,30px)] leading-snug">{t.quote}</p>
              <p className="mt-5 text-[15px] font-semibold">{t.name}</p>
              {t.role && <p className="text-[13px] text-white/70">{t.role}</p>}
            </motion.div>
          </AnimatePresence>
          <div className="relative mt-6 flex gap-1.5">
            {items.map((x, k) => (
              <button
                key={k}
                onClick={() => setI(k)}
                aria-label={`Show story ${k + 1}`}
                className={`h-1.5 rounded-full transition-all ${k === i ? "w-6 bg-white" : "w-1.5 bg-white/40"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
