"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Play, X } from "lucide-react";
import { introVideo } from "@/content/shared";
import { CTA } from "@/content/course";

const noop = () => () => {};
/** False in the server HTML and during hydration, true once the client has taken over. */
const useHydrated = () => useSyncExternalStore(noop, () => true, () => false);

/**
 * "Watch the intro" strip for the hero, plus the overlay player it opens.
 * The video is only fetched once the overlay opens (preload="metadata" until then), so it costs the
 * page nothing on load. Esc, the backdrop and the close button all close it; focus returns to the strip.
 *
 * The overlay is rendered into document.body through a portal. Inside the hero it would sit in an
 * animated (transformed) box, which makes position:fixed relative to that box instead of the screen
 * and puts it under the sticky header.
 */
export default function IntroVideo({ onEnroll }: { onEnroll: () => void }) {
  const [open, setOpen] = useState(false);
  const hydrated = useHydrated();
  const opener = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  const close = useCallback(() => {
    video.current?.pause();
    setOpen(false);
    opener.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <>
      <motion.button
        ref={opener}
        type="button"
        onClick={() => setOpen(true)}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.985 }}
        className="group flex w-full items-center gap-3.5 rounded-[18px] border border-[#e6e4f0] bg-white p-3 text-left shadow-[0_18px_40px_-20px_rgba(60,40,160,.5)]"
        aria-haspopup="dialog"
      >
        <span className="relative aspect-video w-[88px] shrink-0 overflow-hidden rounded-xl bg-[#1f2026] ring-1 ring-black/10">
          <Image src={introVideo.poster} alt="" fill sizes="88px" className="object-cover" />
          <span className="absolute inset-0 flex items-center justify-center bg-black/10">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/95 shadow-md">
              <Play size={13} fill="currentColor" className="ml-0.5 text-[#7c3aed]" />
            </span>
          </span>
        </span>
        <span className="min-w-0 flex-1 leading-snug">
          <span className="block text-[15px] font-bold text-foreground">
            {introVideo.title} <span className="font-medium text-muted">· {introVideo.length}</span>
          </span>
          <span className="mt-0.5 block text-[12.5px] text-muted">{introVideo.caption}</span>
        </span>
        <ArrowRight size={20} className="shrink-0 text-[#4b4f58] transition-transform group-hover:translate-x-1" />
      </motion.button>

      {hydrated &&
        createPortal(
      <AnimatePresence>
        {open && (
          <motion.div
            key="intro-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Intro video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.96, y: 14 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.97, y: 8 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[960px] overflow-hidden rounded-2xl bg-[#0d0e12] shadow-[0_40px_90px_-30px_rgba(0,0,0,.9)]"
            >
              <button
                ref={closeBtn}
                type="button"
                onClick={close}
                aria-label="Close video"
                className="absolute right-2.5 top-2.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                <X size={18} />
              </button>
              <video
                ref={video}
                src={introVideo.src}
                poster={introVideo.poster}
                controls
                autoPlay
                playsInline
                preload="metadata"
                className="aspect-video w-full bg-black"
              >
                Your browser does not support video playback.
              </video>
              <div className="flex flex-col items-stretch justify-between gap-3 border-t border-white/10 px-4 py-3 sm:flex-row sm:items-center">
                <p className="text-[13.5px] text-white/75">Ready to start? The offer is live for a limited time.</p>
                <button
                  type="button"
                  onClick={() => {
                    close();
                    onEnroll();
                  }}
                  className="btn-primary hero-cta h-11 px-6 text-[14px]"
                >
                  {CTA} <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
          document.body
        )}
    </>
  );
}
