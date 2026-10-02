"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ActivityEvent } from "@/content/corporate-launch";

const FIRST_DELAY = 7000;
const VISIBLE_MS = 4800;
const GAP_MS = 16000;

const AVATARS = ["from-[#3b6bff] to-[#22d3ee]", "from-[#7c5cff] to-[#e44fd6]", "from-[#10b981] to-[#22d3ee]"];

/**
 * Purchase-activity toasts. Pass real enrollment events once a feed exists;
 * `events` flagged `sample` should only ever be passed in development.
 */
export default function ActivityToasts({
  events,
  enabled,
  raised,
  paused,
  mobile = "top",
}: {
  events: ActivityEvent[];
  enabled: boolean;
  /** lift above a bottom-docked offer bar */
  raised: boolean;
  paused: boolean;
  /** where the toast sits on phones; use "bottom" when the page has a sticky top bar */
  mobile?: "top" | "bottom";
}) {
  const [index, setIndex] = useState(-1);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled || paused || events.length === 0) return;
    if (visible) {
      const hide = setTimeout(() => setVisible(false), VISIBLE_MS);
      return () => clearTimeout(hide);
    }
    const show = setTimeout(
      () => {
        setIndex((i) => (i + 1) % events.length);
        setVisible(true);
      },
      index === -1 ? FIRST_DELAY : GAP_MS
    );
    return () => clearTimeout(show);
  }, [enabled, paused, events.length, visible, index]);

  if (!enabled || events.length === 0) return null;
  const e = index >= 0 ? events[index] : null;
  const who = e?.name;

  return (
    <div
      className={`pointer-events-none fixed left-3 right-3 z-50 flex justify-center transition-[bottom] duration-500 sm:left-5 sm:right-auto sm:top-auto sm:justify-start ${
        mobile === "top" ? "top-3" : "bottom-3"
      } ${raised ? "sm:bottom-28" : "sm:bottom-5"}`}
    >
      <AnimatePresence>
        {visible && e && (
          <motion.div
            key={index}
            initial={{ y: 40, opacity: 0, scale: 0.92 }}
            animate={{ y: 0, opacity: 1, scale: [0.92, 1.04, 1] }}
            exit={{ y: 24, opacity: 0, scale: 0.96 }}
            transition={{
              y: { type: "spring", stiffness: 320, damping: 22 },
              scale: { duration: 0.5, times: [0, 0.6, 1], ease: "easeOut" },
              opacity: { duration: 0.25 },
            }}
            className="glass-dark pointer-events-auto relative flex items-center gap-3 rounded-2xl py-2.5 pl-2.5 pr-4"
          >
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-2xl"
              initial={{ boxShadow: "0 0 0 1px rgba(52,211,153,.6), 0 0 40px rgba(52,211,153,.45)" }}
              animate={{ boxShadow: "0 0 0 1px rgba(52,211,153,.12), 0 0 0px rgba(52,211,153,0)" }}
              transition={{ duration: 1.6 }}
            />
            <span
              className={`relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-[13px] font-bold text-white ${
                AVATARS[index % AVATARS.length]
              }`}
            >
              {who?.charAt(0)}
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[var(--toast-ring,#0a0e22)] bg-[#34d399]" />
            </span>
            <div className="relative">
              <p className="text-[13px] font-semibold">
                🎉 {who} from {e.city} just enrolled
              </p>
              <p className="text-[11px] text-muted">
                AI Corporate Analyst · just now
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
