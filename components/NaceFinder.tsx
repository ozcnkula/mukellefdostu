"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { NACE_CODES, type NaceCode } from "@/lib/nace-codes";

function fold(value: string) {
  return value.toLocaleLowerCase("tr-TR");
}

export function NaceFinder() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<NaceCode | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  const needle = fold(query.trim());
  const results = useMemo(() => {
    if (needle.length < 2) return [];
    const parts = needle.split(/\s+/).filter(Boolean);
    const scored: { item: NaceCode; rank: number }[] = [];
    for (const item of NACE_CODES) {
      const title = fold(`${item.code} ${item.group} ${item.title}`);
      const tags = fold(item.tags ?? "");
      if (!parts.every((part) => `${title} ${tags}`.includes(part))) continue;
      scored.push({ item, rank: parts.some((part) => tags.includes(part)) ? 0 : 1 });
    }
    scored.sort((a, b) => a.rank - b.rank);
    return scored.slice(0, 24).map((row) => row.item);
  }, [needle]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!selected) {
      setStatus("error");
      setMessage("Önce listeden bir NACE kodu seçin.");
      return;
    }
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/teklif", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "nace",
          name,
          phone,
          email,
          code: selected.code,
        }),
      });
      const data = (await response.json()) as { success?: boolean; error?: string };
      if (!response.ok || !data.success) {
        setStatus("error");
        setMessage(data.error || "Talep gönderilemedi.");
        return;
      }
      setStatus("sent");
      setMessage("Talebiniz alındı. Seçtiğiniz kodla birlikte dönüş yapılır.");
      setName("");
      setPhone("");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Talep gönderilemedi.");
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="mb-3 text-sm font-medium text-blue-300">Kuruluş aracı</p>
      <h1 className="mb-3 text-3xl font-extrabold tracking-tight sm:text-4xl">NACE kod bulucu</h1>
      <p className="mb-8 text-slate-400">
        Faaliyetinizi bir kelimeyle arayın. Listelenen kod ve açıklama, sicile yazılacak altılı kodu seçerken başlangıç noktasıdır.
      </p>

      <label className="relative block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="yazılım, e-ticaret, danışmanlık"
          className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 pl-10 pr-4 text-slate-100 outline-none ring-blue-500/40 placeholder:text-slate-500 focus:ring-2"
        />
      </label>

      <div className="mt-4 space-y-2">
        {needle.length < 2 ? (
          <p className="rounded-xl border border-dashed border-slate-800 px-4 py-6 text-sm text-slate-500">En az iki harf yazın.</p>
        ) : results.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-800 px-4 py-6 text-sm text-slate-500">Bu kelimeyle eşleşen kod yok.</p>
        ) : (
          results.map((item) => {
            const active = selected?.code === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  setSelected(item);
                  setStatus("idle");
                  setMessage("");
                }}
                className={`block w-full rounded-xl border px-4 py-3 text-left transition ${
                  active ? "border-blue-500 bg-blue-500/10" : "border-slate-800 bg-slate-900 hover:border-slate-700"
                }`}
              >
                <span className="font-mono text-sm font-semibold text-blue-300">{item.code}</span>
                <span className="mt-1 block text-sm text-slate-200">{item.title}</span>
                <span className="mt-1 block text-xs text-slate-500">{item.group}</span>
              </button>
            );
          })
        )}
      </div>

      <form id="nace-teklif" onSubmit={submit} className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-lg font-semibold text-slate-100">Bu kodla kuruluş teklifi alın</h2>
        <p className="mt-1 text-sm text-slate-400">
          {selected ? (
            <>
              Seçilen kod: <span className="font-mono text-blue-300">{selected.code}</span>
            </>
          ) : (
            "Önce yukarıdan bir kod seçin."
          )}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ad soyad"
            className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/40"
          />
          <input
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Telefon"
            inputMode="tel"
            className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/40"
          />
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="E-posta"
            className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/40 sm:col-span-2"
          />
        </div>
        <button
          type="submit"
          disabled={status === "sending"}
          className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:opacity-60"
        >
          {status === "sending" ? "Gönderiliyor" : "Kuruluş teklifi iste"}
        </button>
        {message ? <p className={`mt-3 text-sm ${status === "sent" ? "text-teal-300" : "text-amber-300"}`}>{message}</p> : null}
        <p className="mt-4 text-xs leading-relaxed text-slate-500">
          Liste, İstanbul Ticaret Odası meslek-NACE rehberindeki altılı kodlardan derlenmiştir. Vergi dairesi ve ticaret sicilindeki güncel kod esastır. Form bir ön görüşme talebidir; mali müşavirlik sözleşmesi kurmaz.
        </p>
      </form>
    </section>
  );
}
