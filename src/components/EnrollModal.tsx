"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2, ShieldCheck } from "lucide-react";
import { readAttribution } from "@/lib/attribution";
import { cohort } from "@/content/shared";
import type { Audience, PricingConfig } from "@/content/types";

interface EnrollModalProps {
  open: boolean;
  onClose: () => void;
  audience: Audience;
  pricing: PricingConfig;
  courseName: string;
}

export default function EnrollModal({
  open,
  onClose,
  audience,
  pricing,
  courseName,
}: EnrollModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Store the landing UTMs once, so they survive even if the query string is lost.
  useEffect(() => {
    readAttribution();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audience, name, email, phone, attribution: readAttribution() }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error ?? "Something went wrong. Please try again.");
      }

      const { load } = await import("@cashfreepayments/cashfree-js");
      const cashfree = await load({
        mode: process.env.NEXT_PUBLIC_CASHFREE_MODE === "production"
          ? "production"
          : "sandbox",
      });

      await cashfree?.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_self",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl border border-border p-6 shadow-2xl sm:p-8"
            style={{ background: "var(--modal-bg)" }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted transition hover:bg-surface-2 hover:text-foreground"
            >
              <X size={18} />
            </button>

            <p className="text-sm font-medium text-muted">{courseName}</p>
            <h3 className="display mt-1 text-2xl text-foreground">
              Reserve your seat
            </h3>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">
                ₹{pricing.offerPrice.toLocaleString("en-IN")}
              </span>
              <span className="text-sm text-muted line-through">
                ₹{pricing.listPrice.toLocaleString("en-IN")}
              </span>
              <span className="badge px-2 py-0.5">
                {Math.round((1 - pricing.offerPrice / pricing.listPrice) * 100)}% off
              </span>
            </div>
            <p className="mt-1 text-xs text-muted">Total payable, GST included. No extra charges.</p>

            <form onSubmit={handleSubmit} autoComplete="on" className="mt-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm text-muted">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  autoCapitalize="words"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="rounded-xl border border-border bg-surface-2 px-4 py-3 text-base text-foreground outline-none transition placeholder:text-muted/60 focus:border-accent sm:text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="text-sm text-muted">
                  WhatsApp number
                </label>
                <input
                  id="phone"
                  name="tel"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={14}
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="rounded-xl border border-border bg-surface-2 px-4 py-3 text-base text-foreground outline-none transition placeholder:text-muted/60 focus:border-accent sm:text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm text-muted">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="rounded-xl border border-border bg-surface-2 px-4 py-3 text-base text-foreground outline-none transition placeholder:text-muted/60 focus:border-accent sm:text-sm"
                />
              </div>
              <p className="-mt-1 text-xs text-muted">
                Your {cohort.platform} link for class 1 ({cohort.startsLabel}) is sent here on {cohort.deliveredVia} right after payment.
              </p>

              {error && <p className="text-sm text-danger">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary mt-2 w-full"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {submitting
                  ? "Redirecting to payment…"
                  : `Pay ₹${pricing.offerPrice.toLocaleString("en-IN")} securely`}
              </button>

              <p className="flex items-center justify-center gap-1.5 text-xs text-muted">
                <ShieldCheck size={13} />
                Secured checkout powered by Cashfree
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
