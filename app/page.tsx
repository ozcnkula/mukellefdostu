"use client";

import React, { useState } from "react";
import TaxCalculator from "@/components/TaxCalculator";
import { PROFILE_LABELS, useSite, type ProfileId } from "@/components/SiteProvider";
import AiAssistant from "@/components/AiAssistant";
import LegalConsulting from "@/components/LegalConsulting";
import {
  Building2,
  ShoppingCart,
  Laptop,
  Briefcase,
  Calculator,
  Bot,
  Scale,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  Send,
  Sparkles,
} from "lucide-react";

const PROFILES: { id: ProfileId; icon: React.ReactNode; desc: string }[] = [
  {
    id: "yeni-girisimci",
    icon: <Building2 className="w-6 h-6 text-blue-400" />,
    desc: "Şirket kurma, basit usul vs. bilanço hesabı ve kuruluş maliyetleri rehberi.",
  },
  {
    id: "e-ticaret",
    icon: <ShoppingCart className="w-6 h-6 text-indigo-400" />,
    desc: "Trendyol, Hepsiburada pazaryeri entegrasyonu ve e-Fatura zorunlulukları.",
  },
  {
    id: "freelancer",
    icon: <Laptop className="w-6 h-6 text-teal-400" />,
    desc: "Yurt dışı yazılım/tasarım ihracatı ve %80 kazanç istisnası yönetimi.",
  },
  {
    id: "mikro-ihracat",
    icon: <Briefcase className="w-6 h-6 text-purple-400" />,
    desc: "ETGB düzenlemeleri, KDV iadesi ve kargo beyanname süreçleri.",
  },
];

export default function Home() {
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadError, setLeadError] = useState("");
  const [leadData, setLeadData] = useState({ name: "", email: "", phone: "", note: "" });

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadError("");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        setLeadError("Talep gönderilemedi. Lütfen tekrar deneyin.");
        return;
      }

      setLeadSubmitted(true);
    } catch (err) {
      console.error(err);
      setLeadError("Talep gönderilemedi. Lütfen tekrar deneyin.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a href="#hero" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">M</div>
            <span className="text-xl font-bold tracking-tight text-white">
              mukellefdostu<span className="text-blue-500">.com</span>
            </span>
          </a>
          <div className="flex items-center gap-3">
            <a href="/rehber" className="hidden items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white sm:flex">
              <BookOpen className="h-4 w-4 text-amber-400" /> Bilgi Merkezi
            </a>
            <a href="#lead-form" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500">
              Ücretsiz Danışmanlık
            </a>
          </div>
        </div>
      </header>

      <section id="hero" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-16 pt-20 text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-800 bg-blue-950 px-3 py-1 text-xs font-medium text-blue-400">
          <Sparkles className="h-3.5 w-3.5" /> 2026 Mevzuatına %100 Uyumlu
        </span>
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl">
          Bürokratik Engellere Değil, <br />
          <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">İşini Büyütmeye Odaklan</span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-400">
          E-fatura, vergi hesaplama ve mali danışmanlık süreçlerinde girişimciler ve e-ticaretçiler için tasarlanmış akıllı rehber platform.
        </p>
        <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-3">
          <a href="#hesaplayici" className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:border-blue-500/50">
            <Calculator className="h-4 w-4 text-blue-400" /> Şahıs vs. Ltd. Hesaplayıcı
          </a>
          <a href="#ai-asistan" className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:border-blue-500/50">
            <Bot className="h-4 w-4 text-blue-400" /> AI Mali Asistan
          </a>
          <a href="#hukuk-danismanligi" className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:border-blue-500/50">
            <Scale className="h-4 w-4 text-indigo-400" /> Hukuk & Uyum
          </a>
          <a href="/rehber" className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:border-amber-500/50">
            <BookOpen className="h-4 w-4 text-amber-400" /> Bilgi Merkezi
          </a>
        </div>
      </section>

      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="mb-2 text-center text-xl font-bold text-slate-200">Profilinizi Seçin</h2>
          <p className="mb-8 text-center text-sm text-slate-400">Seçiminiz sağ alttaki AI asistana bağlam olarak iletilir.</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {PROFILES.map((profile) => (
              <ProfileCard key={profile.id} id={profile.id} icon={profile.icon} desc={profile.desc} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <TaxCalculator />
        </div>
      </section>

      <section id="ai-asistan" className="scroll-mt-24 border-t border-slate-800">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <AiAssistant />
        </div>
      </section>

      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <LegalConsulting />
        </div>
      </section>

      <section id="lead-form" className="scroll-mt-24 border-t border-slate-800">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <aside className="mb-6 flex gap-3 rounded-2xl border border-amber-500/30 bg-amber-950/40 p-5 text-sm leading-relaxed text-amber-100">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden="true" />
            <p>
              Yasal Uyarı: Bu platformdaki hesaplamalar ve AI asistan yanıtları 2026 resmi tebliğlerine dayanır ancak genel bilgilendirme amaçlıdır. NACE kodunuz, sigortalılık haliniz ve güncel GİB tebliğlerine göre mali müşavir desteği almanız önerilir. Araçlar yönlendirir, nihai karar mali müşavir eşliğinde verilir.
            </p>
          </aside>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
            <h2 className="mb-2 text-2xl font-bold text-white">Uzman Danışmanlığı İsteyin</h2>
            <p className="mb-6 text-sm text-slate-400">Mali süreçlerinizi ve entegrasyonlarınızı uzman partner ağımızla çözelim.</p>

            {leadSubmitted ? (
              <div className="flex items-center gap-3 rounded-xl border border-emerald-800 bg-emerald-950/50 p-4 text-emerald-400">
                <CheckCircle2 className="h-6 w-6 shrink-0" />
                <span>Talebiniz başarıyla alındı! En kısa sürede sizinle iletişime geçeceğiz.</span>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div>
                  <label htmlFor="lead-name" className="mb-1 block text-xs font-medium text-slate-400">Ad Soyad</label>
                  <input
                    id="lead-name"
                    required
                    type="text"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                    value={leadData.name}
                    onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="lead-email" className="mb-1 block text-xs font-medium text-slate-400">E-Posta Adresi</label>
                  <input
                    id="lead-email"
                    required
                    type="email"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                    value={leadData.email}
                    onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="lead-phone" className="mb-1 block text-xs font-medium text-slate-400">Telefon</label>
                  <input
                    id="lead-phone"
                    required
                    type="tel"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                    value={leadData.phone}
                    onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                  />
                </div>
                {leadError ? <p className="text-sm text-red-400">{leadError}</p> : null}
                <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-500">
                  <Send className="h-4 w-4" /> Talep Gönder
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-500">
        © 2026 mukellefdostu.com - Tüm Hakları Saklıdır.
      </footer>
    </main>
  );
}

function ProfileCard({ id, icon, desc }: { id: ProfileId; icon: React.ReactNode; desc: string }) {
  const { profileId, setProfileId } = useSite();
  const selected = profileId === id;

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => setProfileId(selected ? null : id)}
      className={`rounded-xl border bg-slate-900 p-5 text-left transition ${
        selected ? "border-teal-500 ring-1 ring-teal-500/60" : "border-slate-800 hover:border-slate-700"
      }`}
    >
      <div className="mb-3">{icon}</div>
      <h3 className="mb-1 font-semibold text-slate-200">{PROFILE_LABELS[id]}</h3>
      <p className="text-xs leading-relaxed text-slate-400">{desc}</p>
    </button>
  );
}
