"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { AssistantReplyBody } from "@/components/AssistantReplyBody";
import { PROFILE_LABELS, useSite } from "@/components/SiteProvider";
import { answerQuestion, simulatorSentence, type AssistantReply } from "@/lib/assistant";
import { trackEvent } from "@/lib/track";

const GREETING = "Merhaba, bilgi merkezinden bir vergi veya SGK sorusu sorun.";

const INTRO: AssistantReply = {
  text: "Bilgi merkezindeki şirket, vergi ve SGK notlarından yanıt veririm. Sorunuzu yazın.",
  source: null,
  related: [],
  contactHref: null,
  calculatorHref: null,
};

const CHIPS = [
  "E-Fatura zorunluluğum var mı?",
  "Şahıs mı Ltd mi daha avantajlı?",
  "KDV beyannamesi ne zaman?",
  "Zarar edersem geçici vergi öder miyim?",
] as const;

type ChatMessage = { role: "user"; text: string } | { role: "assistant"; reply: AssistantReply };

export default function FloatingAssistant() {
  const { profileId, simulator } = useSite();
  const [open, setOpen] = useState(false);
  const [greet, setGreet] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "assistant", reply: INTRO }]);
  const scroller = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const node = scroller.current;
    if (!node) return;
    node.scrollTo({ top: node.scrollHeight });
  }, [messages, open]);

  const ask = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;
    trackEvent("ai");
    const profileLabel = profileId ? PROFILE_LABELS[profileId] : null;
    const reply = answerQuestion(trimmed, profileLabel, simulator);
    setMessages((current) => [...current, { role: "user", text: trimmed }, { role: "assistant", reply }]);
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
          aria-label="Mali asistan"
          className="fixed inset-0 z-[60] flex flex-col bg-slate-950 sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[560px] sm:w-[380px] sm:rounded-2xl sm:border sm:border-slate-700 sm:shadow-2xl"
        >
          <header className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-600 text-white">
                <Bot className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">2026 AI Mali Asistan</p>
                <p className="text-xs text-teal-300">Bilgi merkezi</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Asistanı kapat"
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="border-b border-slate-800 px-4 py-2 text-xs leading-relaxed text-slate-400">
            {profileId ? <p>Profil: {PROFILE_LABELS[profileId]}</p> : <p>Profil seçilmedi.</p>}
            {simulator ? <p>{simulatorSentence(simulator)}</p> : <p>Simülatör henüz kullanılmadı.</p>}
          </div>

          <div ref={scroller} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) =>
              message.role === "user" ? (
                <p key={`user-${index}`} className="ml-auto max-w-[90%] rounded-2xl bg-blue-600 px-3 py-2 text-sm leading-relaxed text-white">
                  {message.text}
                </p>
              ) : (
                <div key={`assistant-${index}`} className="max-w-[90%] rounded-2xl bg-slate-900 px-3 py-2 text-sm leading-relaxed text-slate-200">
                  <AssistantReplyBody reply={message.reply} />
                </div>
              ),
            )}
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
                aria-label="Bilgi merkezine soru"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                aria-label="Soruyu gönder"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-600 text-white hover:bg-teal-500"
              >
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
          <span className="sr-only">Mali asistanı aç</span>
        </button>
      )}
    </>
  );
}
