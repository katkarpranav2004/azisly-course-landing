"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { cohort } from "@/content/shared";
import type { Audience } from "@/content/types";

type Status = "loading" | "paid" | "pending" | "failed";

export default function OrderStatusView({
  orderId,
  audience,
}: {
  orderId: string | null;
  audience: Audience;
}) {
  const [status, setStatus] = useState<Status>(orderId ? "loading" : "failed");

  useEffect(() => {
    if (!orderId) return;

    let cancelled = false;

    async function check() {
      try {
        const res = await fetch(`/api/checkout/status?order_id=${encodeURIComponent(orderId!)}`);
        const data = await res.json();
        if (cancelled) return;

        if (data.status === "PAID") setStatus("paid");
        else if (data.status === "ACTIVE") setStatus("pending");
        else setStatus("failed");
      } catch {
        if (!cancelled) setStatus("failed");
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const backHref = `/${audience}`;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 py-16 text-center">
      {status === "loading" && (
        <>
          <Loader2 size={40} className="animate-spin text-accent" />
          <p className="mt-4 text-muted">Confirming your payment…</p>
        </>
      )}

      {status === "paid" && (
        <>
          <CheckCircle2 size={48} className="text-success" />
          <h1 className="mt-5 text-2xl font-bold text-foreground">
            You&apos;re enrolled 🎉
          </h1>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Welcome to the AI Corporate Analyst program. Your {cohort.platform} link
            and onboarding details are on their way to your {cohort.deliveredVia}.
          </p>
          <p className="mt-3 rounded-full bg-surface-2 px-4 py-1.5 text-sm font-medium text-foreground">
            Class 1 is live on {cohort.platform} on {cohort.startsLabel}
          </p>
        </>
      )}

      {status === "pending" && (
        <>
          <Loader2 size={40} className="animate-spin text-accent-2" />
          <h1 className="mt-5 text-2xl font-bold text-foreground">
            Payment in progress
          </h1>
          <p className="mt-2 max-w-sm text-sm text-muted">
            We haven&apos;t received confirmation yet. If your payment app showed
            success, this will update shortly. No need to pay again.
          </p>
        </>
      )}

      {status === "failed" && (
        <>
          <XCircle size={48} className="text-danger" />
          <h1 className="mt-5 text-2xl font-bold text-foreground">
            We couldn&apos;t confirm this payment
          </h1>
          <p className="mt-2 max-w-sm text-sm text-muted">
            If money was deducted, it will be refunded automatically. You can
            try enrolling again below.
          </p>
        </>
      )}

      <Link
        href={backHref}
        className="mt-8 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-surface-2"
      >
        Back to course page
      </Link>
    </div>
  );
}
