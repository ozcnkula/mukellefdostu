"use client";

import React, { useState } from "react";
import TaxCalculator from "@/components/TaxCalculator";
import { PROFILE_LABELS, useSite, type ProfileId } from "@/components/SiteProvider";
import { LEAD_TOPICS } from "@/lib/lead-topics";
import { trackEvent } from "@/lib/track";
import AiAssistant from "@/components/AiAssistant";
import LegalConsulting from "@/components/LegalConsulting";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
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
  FileDown,
  Send,
  Sparkles,
  Store,
} from "lucide-react";

const CHECKLIST_HREF = "/2026-e-ticaret-vergi-checklist.pdf";

function downloadChecklist() {
  trackEvent("checklist");
  const link = document.createElement("a");
  link.href = CHECKLIST_HREF;
  link.download = "2026-e-ticaret-vergi-checklist.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

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
  const [leadData, setLeadData] = useState({ name: "", phone: "", topic: "" });

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
      downloadChecklist();
    } catch (err) {
      console.error(err);
      setLeadError("Talep gönderilemedi. Lütfen tekrar deneyin.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 font-sans text-slate-100">
      <SiteHeader />

      <section id="hero" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-24 pt-10 text-center sm:px-6 sm:pb-16 sm:pt-20">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-800 bg-blue-950 px-3 py-1 text-xs font-medium text-blue-400">
          <Sparkles className="h-3.5 w-3.5" /> 2026 Mevzuatına Göre Güncel Bilgiler
        </span>
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight sm:mb-6 sm:text-4xl md:text-6xl">
          Bürokratik Engellere Değil, <br />
          <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">İşini Büyütmeye Odaklan</span>
        </h1>
        <p className="mx-auto mb-6 max-w-2xl text-base text-slate-400 sm:mb-10 sm:text-lg">
          Araçlar vergi, Bağ-Kur ve kuruluş başlıklarını sadeleştirir. Beyanname, defter ve mevzuat uygulaması mali müşavirin bilgisiyle yürür. Karar, sizin işletmenize bakılarak birlikte verilir.
        </p>
        <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-3 pr-12 sm:pr-0">
          <a href="#hesaplayici" className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:border-blue-500/50">
            <Calculator className="h-4 w-4 text-blue-400" /> Vergi, Bağ-Kur ve maliyet
          </a>
          <a href="#ai-asistan" className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:border-blue-500/50">
            <Bot className="h-4 w-4 text-blue-400" /> Vergi, SGK ve kuruluş
          </a>
          <a href="/rehber" className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:border-amber-500/50">
            <BookOpen className="h-4 w-4 text-amber-400" /> Mevzuat rehberi
          </a>
          <a href="#lead-form" className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-500">
            <FileDown className="h-4 w-4" /> Kuruluş checklist’i
          </a>
          <a href="#hukuk-danismanligi" className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:border-blue-500/50">
            <Scale className="h-4 w-4 text-indigo-400" /> Hukuk ve uyum notları
          </a>
          <a href="/e-ticaret-vergi" className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:border-teal-500/50">
            <Store className="h-4 w-4 text-teal-400" /> E-ticaret vergi rehberi
          </a>
        </div>
      </section>

      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="mb-8 text-center text-xl font-bold text-slate-200">Nasıl çalışıyoruz?</h2>
          <ol className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              ["1", "İhtiyacınızı öğreniyoruz."],
              ["2", "İşletmenizin durumunu değerlendiriyoruz."],
              ["3", "Muhasebe ve mali süreçlerinizi birlikte yürütüyoruz."],
            ].map(([step, text]) => (
              <li key={step} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                <span className="mb-3 grid h-8 w-8 place-items-center rounded-full bg-teal-600 text-sm font-bold text-white">{step}</span>
                <p className="font-medium text-slate-100">{text}</p>
              </li>
            ))}
          </ol>
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
            <h2 className="mb-2 text-2xl font-bold text-white">Ön görüşme talep edin</h2>
            <p className="mb-6 text-sm text-slate-400">Adınızı ve telefonunuzu bırakın. Kuruluş checklist’i bilgilendirme notu olarak iner. Bu form mali müşavirlik sözleşmesi kurmaz.</p>

            {leadSubmitted ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-xl border border-emerald-800 bg-emerald-950/50 p-4 text-emerald-300">
                  <CheckCircle2 className="h-6 w-6 shrink-0" />
                  <p>Teşekkürler. Bilgilerinizi aldık. En kısa sürede sizi arayacağız.</p>
                </div>
                <div className="rounded-xl border border-teal-800 bg-teal-950/40 p-4 text-sm text-teal-100">
                  <p className="font-semibold">Checklist’inizi indirdiniz mi?</p>
                  <p className="mt-1 text-teal-200/90">İnmediyse buradan tekrar alabilirsiniz.</p>
                  <a
                    href={CHECKLIST_HREF}
                    download="2026-e-ticaret-vergi-checklist.pdf"
                    onClick={() => trackEvent("checklist")}
                    className="mt-3 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500"
                  >
                    <FileDown className="h-4 w-4" /> 2026 E-Ticaret & Vergi Checklist
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div>
                  <label htmlFor="lead-name" className="mb-1 block text-xs font-medium text-slate-400">Ad Soyad</label>
                  <input
                    id="lead-name"
                    required
                    type="text"
                    autoComplete="name"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                    value={leadData.name}
                    onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="lead-phone" className="mb-1 block text-xs font-medium text-slate-400">Telefon</label>
                  <input
                    id="lead-phone"
                    required
                    type="tel"
                    autoComplete="tel"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                    value={leadData.phone}
                    onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="lead-topic" className="mb-1 block text-xs font-medium text-slate-400">Ne istiyorsun?</label>
                  <select
                    id="lead-topic"
                    required
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                    value={leadData.topic}
                    onChange={(e) => setLeadData({ ...leadData, topic: e.target.value })}
                  >
                    <option value="">Seçin</option>
                    {LEAD_TOPICS.map((topic) => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))}
                  </select>
                </div>
                {leadError ? <p className="text-sm text-red-400">{leadError}</p> : null}
                <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-500">
                  <Send className="h-4 w-4" /> Görüşme talep et
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="mb-6 text-center text-xl font-bold text-slate-200">Sıkça sorulan sorular</h2>
          <div className="space-y-3">
            {FAQ.map((item) => (
              <details key={item.q} className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
                <summary className="cursor-pointer font-medium text-slate-100">{item.q}</summary>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

const FAQ = [
  {
    q: "Şirket kurduktan sonra mali müşavir zorunlu mu?",
    a: "Bilanço esasına göre defter tutan işletmelerde defter ve beyannameler meslek mensubuyla yürütülür. Şahıs işletmesinde usul, had ve faaliyet türüne göre değişir. Kuruluştan sonra hangi defterin tutulacağı ayrıca bakılır.",
  },
  {
    q: "Şahıs şirketi mi, limited şirket mi?",
    a: "Tek bir cevap yoktur. Vergi dilimi, Bağ-Kur, kârın şirkette kalıp kalmayacağı ve ortaklık yapısı sonucu değiştirir. Sayfadaki hesaplayıcı bu başlıkları örnek rakamla yan yana koyar; nihai seçim mali müşavirle yapılır.",
  },
  {
    q: "Şirketim yokken fatura kesebilir miyim?",
    a: "Ticari fatura için önce vergi mükellefiyeti gerekir. Mükellefiyet açılmadan kendi adınıza satış faturası düzenlenmez. Arızi kazanç ile sürekli ticaret aynı işleme girmez.",
  },
  {
    q: "Aylık muhasebe ücreti neye göre belirlenir?",
    a: "Ücret; evrak hacmi, çalışan sayısı, e-belge, pazaryeri ve beyanname yüküne göre belirlenir. Sitede sabit bir fiyat listesi yayımlanmaz. Kapsam ön görüşmede konuşulur, yazılı sözleşmede yer alır.",
  },
  {
    q: "Şirket açılışından sonra hangi yükümlülüklerim var?",
    a: "Vergi levhası, e-belge ve defter düzeni, KDV ve muhtasar dönemleri, çalışan varsa SGK bildirgeleri ve ticaret sicil yükümlülükleri ilk bakılacak başlıklardır. Checklist bu listeyi hatırlatır, başvuruyu sizin adınıza yapmaz.",
  },
];

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
