"use client";

import { useEffect, useState } from "react";

export type OfferZone =
  | "hero"
  | "pain"
  | "transform"
  | "benefits"
  | "proof"
  | "experts"
  | "modules"
  | "faq"
  | "final";

/** Tracks which `[data-offer-zone]` section currently crosses the middle of the viewport. */
export function useOfferZone(): OfferZone {
  const [zone, setZone] = useState<OfferZone>("hero");

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-offer-zone]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setZone(e.target.getAttribute("data-offer-zone") as OfferZone);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return zone;
}

export function useIsMobile(breakpoint = 640) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);
  return mobile;
}
