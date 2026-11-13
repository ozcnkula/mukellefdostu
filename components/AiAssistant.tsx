"use client";

import { FormEvent, useState } from "react";
import { Bot, Send } from "lucide-react";
import { AssistantReplyBody } from "@/components/AssistantReplyBody";
import { PROFILE_LABELS, useSite } from "@/components/SiteProvider";
import { answerQuestion, type AssistantReply } from "@/lib/assistant";
import { trackEvent } from "@/lib/track";

const INTRO =
  "Bilgi merkezindeki şirket, vergi ve SGK notlarından sorun. Yanıt, ilgili yazıya bağlanır.";

export default function AiAssistant() {
  const { profileId, simulator } = useSite();
  const [query, setQuery] = useState("");
  const [reply, setReply] = useState<AssistantReply | null>(null);

  const handleAsk = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    trackEvent("ai");
    const profileLabel = profileId ? PROFILE_LABELS[profileId] : null;
    setReply(answerQuestion(trimmed, profileLabel, simulator));
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
      <div className="mb-4 flex items-center gap-3 border-b border-slate-800 pb-4">
        <Bot className="h-6 w-6 text-blue-400" />
        <div>
          <h3 className="font-semibold text-white">2026 AI Mali Asistan</h3>
          <p className="text-xs text-slate-400">Vergi, SGK ve şirket kuruluşu soruları. Yanıt, bilgi merkezindeki nota bağlanır.</p>
        </div>
      </div>
      <div
        aria-live="polite"
        className="mb-4 min-h-[90px] rounded-xl border border-slate-800/60 bg-slate-950 p-4 text-sm leading-relaxed text-slate-200"
      >
        {reply ? <AssistantReplyBody reply={reply} /> : <p>{INTRO}</p>}
      </div>
      <form onSubmit={handleAsk} className="flex gap-2">
        <input
          type="text"
          placeholder="Örn: KDV beyannamesi ne zaman?"
          aria-label="Bilgi merkezine soru"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          <Send className="h-4 w-4" /> Sor
        </button>
      </form>
    </div>
  );
}
