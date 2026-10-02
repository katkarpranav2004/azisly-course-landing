import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 py-24 text-center">
      <p className="text-sm text-muted">Azisly · AI Corporate Analyst</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/college"
          className="btn-primary text-sm"
        >
          View student page →
        </Link>
        <Link
          href="/corporate"
          className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground"
        >
          View corporate page →
        </Link>
      </div>
    </div>
  );
}
