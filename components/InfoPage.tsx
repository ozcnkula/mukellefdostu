import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export function InfoPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-300">{children}</div>
      </article>
      <SiteFooter />
    </main>
  );
}
