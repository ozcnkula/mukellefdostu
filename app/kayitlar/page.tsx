"use client";

import { FormEvent, useState } from "react";
import { revealSheet } from "./actions";

export default function KayitlarPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");
  const [pending, setPending] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError("");
    const result = await revealSheet(password);
    setPending(false);
    if (result.url) {
      setUrl(result.url);
      return;
    }
    setUrl("");
    setError(result.error ?? "Şifre yanlış.");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-16 text-slate-100">
      <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-white">Kayıtlar</h1>
        <p className="mt-2 text-sm text-slate-400">Talepler Google Sheets’te durur. Bağlantıyı görmek için şifreyi girin.</p>

        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex w-full items-center justify-center rounded-lg bg-teal-600 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-500"
          >
            Google Sheets’i aç
          </a>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="admin-password" className="mb-1 block text-xs font-medium text-slate-400">Şifre</label>
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
            >
              {pending ? "Kontrol ediliyor" : "Bağlantıyı göster"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
