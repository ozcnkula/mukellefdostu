import Link from "next/link";
import { BookOpen } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 px-4 py-3 backdrop-blur sm:px-6 sm:py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <Link href="/#hero" className="flex min-w-0 items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">M</span>
          <span className="truncate text-sm font-bold tracking-tight text-white sm:text-xl">
            mukellefdostu<span className="text-blue-500">.com</span>
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <Link href="/rehber" className="hidden items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white sm:flex">
            <BookOpen className="h-4 w-4 text-amber-400" /> Bilgi Merkezi
          </Link>
          <Link href="/#lead-form" className="rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-500 sm:px-4 sm:py-2 sm:text-sm">
            Ön görüşme
          </Link>
        </div>
      </div>
    </header>
  );
}
