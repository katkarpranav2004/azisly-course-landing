export default function Footer() {
  return (
    <footer className="border-t border-border px-5 pb-28 pt-10 sm:pb-10">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-2 text-center">
        <p className="display text-base">Azisly</p>
        <p className="text-xs text-muted">AI Corporate Analyst Program · Secure payments via Cashfree</p>
        <p className="text-xs text-muted">© {new Date().getFullYear()} Azisly. All rights reserved.</p>
      </div>
    </footer>
  );
}
