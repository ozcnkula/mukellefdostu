"use client";

import { FormEvent, useEffect, useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { PROFILE_LABELS, useSite, type SimulatorSnapshot } from "@/components/SiteProvider";

const GREETING = "Merhaba, 2026 e-fatura veya vergi konusunda sorunuz var mı?";

const CHIPS = [
  "E-Fatura zorunluluğum var mı?",
  "Şahıs mı Ltd mi daha avantajlı?",
  "2026 vergi dilimleri nedir?",
  "Mikro ihracatta KDV iadesi nasıl işler?",
] as const;

type ChatMessage = { role: "user" | "assistant"; text: string };

function tl(amount: number) {
  return `${Math.round(amount).toLocaleString("tr-TR")} TL`;
}

function simulatorSentence(simulator: SimulatorSnapshot) {
  const winner = simulator.winner === "sahis" ? "şahıs şirketi" : "limited şirket";
  const mode = simulator.distribute ? "kârın tamamı dağıtılırsa" : "kâr şirkette kalırsa";
  return `Simülatörde yıllık ${tl(simulator.profit)} vergi öncesi kâr ve “${mode}” seçili. Şahıs neti ${tl(simulator.soleNet)}, limited neti ${tl(simulator.ltdNet)}. Bu seçimde ${winner} daha avantajlı görünüyor.`;
}

export function answerQuestion(question: string, profileLabel: string | null, simulator: SimulatorSnapshot | null) {
  const text = question.toLocaleLowerCase("tr");
  const prefix = profileLabel ? `${profileLabel} profiline göre: ` : "";
  const note = " Bu genel bilgidir; NACE kodu ve güncel tebliğ için mali müşavirinizi esas alın.";

  if (text.includes("e-fatura") || text.includes("e-arşiv") || text.includes("zorunlu")) {
    const profileNote =
      profileLabel === "E-Ticaret Satıcısı"
        ? " Pazaryeri satışında alıcı ve platform genellikle e-fatura veya e-arşiv entegrasyonu ister."
        : profileLabel === "Freelancer & Yazılımcı"
          ? " Yurt dışı hizmette belge türü, müşterinin statüsüne ve istisna şartlarına göre değişir."
          : "";
    return `${prefix}2026’da kağıt veya koçan fatura sınırı 3.000 TL’dir. Bu tutarı aşan satışlarda e-arşiv veya e-fatura gerekir. Ciro haddi ve sektör tebliği de zorunluluk doğurabilir.${profileNote}${note}`;
  }

  if (text.includes("şahıs") || text.includes("ltd") || text.includes("limited") || text.includes("avantaj")) {
    if (simulator) return `${prefix}${simulatorSentence(simulator)}${note}`;
    return `${prefix}Düşük ve öngörülebilir kârda şahıs şirketi çoğu senaryoda daha sade kalır. Kâr şirkette bırakılacaksa limited, yalnızca %25 kurumlar vergisiyle öne geçebilir. Kaydırıcıdaki sonuç, seçtiğiniz dağıtım tercihine göre değişir.${note}`;
  }

  if (text.includes("dilim") || text.includes("gelir vergisi") || text.includes("tarife")) {
    return "2026 ücret dışı gelir tarifesi: 190.000 TL’ye kadar %15, 400.000 TL’ye kadar %20, 1.000.000 TL’ye kadar %27, 5.300.000 TL’ye kadar %35, fazlası %40. Kurumlar vergisi bu simülasyonda %25 kabul edilir." + note;
  }

  if (text.includes("ihracat") || text.includes("kdv iade") || text.includes("iadesi") || text.includes("etgb")) {
    return `${prefix}Mikro ihracatta ETGB ile yapılan teslimler, şartları sağlanırsa KDV’den istisna olabilir. İade; gümrük, kargo ve fatura belgelerinin dönem beyannamesiyle uyumuna bağlıdır. Süreç her satışta otomatik işlemez.${note}`;
  }

  if (text.includes("kağıt") || text.includes("fatura") || text.includes("3000") || text.includes("limit")) {
    return "2026 yılı itibarıyla kağıt veya koçan fatura kesme sınırı 3.000 TL’dir. Bu tutarı aşan satışlarda e-arşiv veya e-fatura kullanılır." + note;
  }

  if (simulator) {
    return `${prefix}Soruyu sabit cevaplarla eşleştiremedim. Elimdeki simülasyon şöyle: ${simulatorSentence(simulator)} Daha ayrıntılı inceleme için alttaki ön görüşme formunu kullanabilirsiniz.`;
  }

  return `${prefix}2026 mali mevzuatına göre bu soru sabit cevapların dışında. E-fatura sınırı, vergi dilimi veya şirket türü için hazır sorulardan birini seçebilir, ayrıntı için ön görüşme formunu doldurabilirsiniz.`;
}

export default function FloatingAssistant() {
  const { profileId, simulator } = useSite();
  const [open, setOpen] = useState(false);
  const [greet, setGreet] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: "2026 e-fatura, vergi dilimi veya şirket türü hakkında sorunuzu yazın." },
  ]);

  useEffect(() => {
    if (sessionStorage.getItem("md-assistant-greet")) return;
    const timer = window.setTimeout(() => {
      setGreet(true);
      sessionStorage.setItem("md-assistant-greet", "1");
    }, 4000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const ask = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;
    const profileLabel = profileId ? PROFILE_LABELS[profileId] : null;
    setMessages((current) => [
      ...current,
      { role: "user", text: trimmed },
      { role: "assistant", text: answerQuestion(trimmed, profileLabel, simulator) },
    ]);
    setDraft("");
  };

  const openPanel = () => {
    setGreet(false);
    setOpen(true);
  };

  return (
    <>
      {greet && !open ? (
        <button
          type="button"
          onClick={openPanel}
          className="fixed bottom-24 right-5 z-[60] max-w-xs rounded-2xl rounded-br-md border border-teal-700/60 bg-slate-900 px-4 py-3 text-left text-sm leading-relaxed text-slate-100 shadow-xl"
        >
          {GREETING}
        </button>
      ) : null}

      {open ? (
        <section
          id="floating-assistant"
          role="dialog"
          aria-label="AI mali asistan"
          className="fixed inset-0 z-[60] flex flex-col bg-slate-950 sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[560px] sm:w-[380px] sm:rounded-2xl sm:border sm:border-slate-700 sm:shadow-2xl"
        >
          <header className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-600 text-white">
                <Bot className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">2026 AI Mali Asistan</p>
                <p className="text-xs text-teal-300">Profil ve simülatör bağlamı</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Asistanı kapat" className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="border-b border-slate-800 px-4 py-2 text-xs leading-relaxed text-slate-400">
            {profileId ? <p>Profil: {PROFILE_LABELS[profileId]}</p> : <p>Profil seçilmedi.</p>}
            {simulator ? <p>{simulatorSentence(simulator)}</p> : <p>Simülatör henüz kullanılmadı.</p>}
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <p
                key={`${message.role}-${index}`}
                className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "ml-auto bg-blue-600 text-white"
                    : "bg-slate-900 text-slate-200"
                }`}
              >
                {message.text}
              </p>
            ))}
          </div>

          <div className="border-t border-slate-800 px-4 py-3">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => ask(chip)}
                  className="shrink-0 rounded-full border border-teal-800 bg-teal-950/40 px-3 py-1.5 text-xs text-teal-200 hover:border-teal-500"
                >
                  {chip}
                </button>
              ))}
            </div>
            <form
              onSubmit={(event: FormEvent) => {
                event.preventDefault();
                ask(draft);
              }}
              className="flex gap-2"
            >
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Sorunuzu yazın"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
              />
              <button type="submit" aria-label="Soruyu gönder" className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-600 text-white hover:bg-teal-500">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </section>
      ) : (
        <button
          type="button"
          onClick={openPanel}
          aria-expanded={false}
          aria-controls="floating-assistant"
          className="fixed bottom-5 right-5 z-[60] grid h-14 w-14 place-items-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-950/50 transition hover:bg-teal-500"
        >
          <span className="relative">
            <MessageCircle className="h-7 w-7" />
            <Bot className="absolute -bottom-1 -right-2 h-4 w-4 rounded-full bg-teal-300 p-0.5 text-slate-950" />
          </span>
          <span className="sr-only">AI mali asistanı aç</span>
        </button>
      )}
    </>
  );
}
