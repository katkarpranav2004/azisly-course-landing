import type { ReactNode } from "react";
import type { Theme } from "@/content/types";

export default function ThemeShell({ theme, children }: { theme: Theme; children: ReactNode }) {
  return (
    <div className={`theme-${theme} relative flex min-h-screen flex-1 flex-col text-foreground`}>
      {theme === "sunset" ? (
        <div aria-hidden className="sunset-bg fixed inset-0 -z-10" />
      ) : (
        <div aria-hidden className="fixed inset-0 -z-10 bg-background" />
      )}
      {children}
    </div>
  );
}
