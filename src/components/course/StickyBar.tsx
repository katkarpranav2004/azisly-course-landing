"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { PricingConfig } from "@/content/types";

export default function StickyBar({ pricing, onEnroll, hidden }: { pricing: PricingConfig; onEnroll: () => void; hidden: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && !hidden && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-[640px] items-center justify-between gap-3 rounded-2xl border border-border bg-white/90 px-4 py-3 shadow-[0_20px_50px_-20px_rgba(30,40,110,.5)] backdrop-blur-xl"
        >
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-foreground">Get AI Corporate Analyst</p>
            <p className="text-[12px] text-muted">
              <b className="text-foreground">₹{pricing.offerPrice.toLocaleString("en-IN")}</b> incl. GST ·{" "}
              <span className="line-through">₹{pricing.listPrice.toLocaleString("en-IN")}</span>
            </p>
          </div>
          <button onClick={onEnroll} className="btn-primary shrink-0 px-5 py-2.5 text-[14px]">
            Enroll now
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
