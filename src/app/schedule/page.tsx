import type { Metadata } from "next";
import Image from "next/image";
import { cohort, curriculum, MODULE_COUNT } from "@/content/shared";
import { getEmailConfig } from "@/lib/email/config";

export const metadata: Metadata = {
  title: "Your class schedule | Azisly",
  description: "All live classes of the AI Corporate Analyst program.",
  robots: { index: false, follow: false },
};

// Dates come from EMAIL_CLASS_DATES, so the page must be read at request time.
export const dynamic = "force-dynamic";

/** The full class list, opened from the "View all classes" button in the welcome email. */
export default function SchedulePage() {
  const { classDates, supportEmail } = getEmailConfig("corporate");
  const d = new Date(cohort.startsAt);
  const f = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-IN", { ...o, timeZone: "Asia/Kolkata" }).format(d);

  return (
    <main className="min-h-screen bg-[#120728] px-4 py-8 text-white sm:px-6 sm:py-12">
      <div className="mx-auto max-w-[640px]">
        <Image src="/logos/azisly-white.svg" alt="Azisly.ai" width={2788} height={937} unoptimized className="h-[34px] w-auto" priority />

        <section className="mt-7 overflow-hidden rounded-3xl bg-gradient-to-br from-[#ffe066] to-[#ffc21a] px-6 py-8 text-center text-[#1a0a2e]">
          <p className="text-[12px] font-bold uppercase tracking-[0.35em] text-[#6b3f00]">Your schedule</p>
          <h1 className="mt-2 font-[family-name:var(--font-serif)] text-[38px] font-bold italic leading-[1.05] sm:text-[46px]">
            {MODULE_COUNT} live classes
          </h1>
          <p className="mt-3 text-[15px] font-medium text-[#5a3500]">
            Class 1 starts {f({ weekday: "long", day: "numeric", month: "long" })}, {f({ hour: "numeric", minute: "2-digit", hour12: true }).toUpperCase()} IST, live on {cohort.platform}
          </p>
        </section>

        <ol className="mt-6 flex flex-col gap-2.5">
          {curriculum.map((m, i) => (
            <li key={m.index} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-[#1d0d40] p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2c1366] font-mono text-[14px] font-bold text-[#ff9be9]">
                {String(m.index).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <span className="text-[16px] font-semibold">{m.title}</span>
                  {m.tag && <span className="rounded-full bg-[#ffd23f] px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-[#1a0a2e]">{m.tag}</span>}
                </span>
                <span className="mt-1 block text-[13.5px] leading-relaxed text-[#cdbbff]">{m.description}</span>
                <span className="mt-1.5 block text-[12px] font-medium uppercase tracking-[0.14em] text-[#9f8ad8]">
                  {m.stage}
                  {classDates[i] ? ` · ${classDates[i]}` : ""}
                </span>
              </span>
            </li>
          ))}
        </ol>

        {classDates.length === 0 && (
          <p className="mt-5 text-center text-[13px] text-[#bda9ee]">Exact dates and timings for each class will be shared before it begins.</p>
        )}

        <p className="mt-8 border-t border-white/10 pt-5 text-center text-[13px] text-[#a995d8]">
          Questions? Write to{" "}
          <a href={`mailto:${supportEmail}`} className="font-semibold text-white underline underline-offset-4">
            {supportEmail}
          </a>
        </p>
      </div>
    </main>
  );
}
