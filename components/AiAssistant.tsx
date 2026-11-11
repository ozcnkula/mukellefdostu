"use client";

import React, { useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import { trackEvent } from "@/lib/track";

const FAQ_DATABASE = [
  { keywords: ["limit", "fatura", "kağıt", "3000"], answer: "2026 yılı itibarıyla GİB düzenlemelerine göre kağıt/koçan fatura kesme sınırı 3.000 TL'dir. Bu tutarı aşan satışlarda e-arşiv veya e-fatura zorunludur." },
  { keywords: ["e-ticaret", "trendyol", "pazaryeri", "komisyon"], answer: "Pazaryeri satışlarında komisyon faturaları gider olarak gösterilebilir. KDV tevkifatı ve e-fatura entegrasyonu zorunludur." },
  { keywords: ["yurtdışı", "freelancer", "yazılım", "istisna"], answer: "Yurt dışına verilen yazılım, tasarım ve mühendislik hizmetlerinde döviz olarak gelen kazançlarda %80 gelir vergisi istisnası uygulanabilmektedir." }
];

export default function AiAssistant() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("2026 e-fatura limitleri, şirket kuruluş maliyetleri veya e-ticaret vergileri hakkında dilediğinizi sorun.");

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    trackEvent("ai");
    const found = FAQ_DATABASE.find(item => item.keywords.some(k => query.toLowerCase().includes(k)));
    if (found) {
      setResponse(found.answer);
    } else {
      setResponse("2026 mali mevzuatına göre bu soruyla ilgili uzman danışmanlarımız detaylı inceleme yapmaktadır. Sayfanın altındaki formdan talep oluşturabilirsiniz.");
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-4">
        <Bot className="w-6 h-6 text-blue-400" />
        <div>
          <h3 className="font-semibold text-white">2026 AI Mali Asistan</h3>
          <p className="text-xs text-slate-400">GİB ve Vergi Mevzuatı Asistanı</p>
        </div>
      </div>
      <div className="bg-slate-950 rounded-xl p-4 mb-4 text-sm text-slate-300 min-h-[90px] border border-slate-800/60">
        <p className="text-slate-200">💡 {response}</p>
      </div>
      <form onSubmit={handleAsk} className="flex gap-2">
        <input 
          type="text" 
          placeholder="Örn: Kağıt fatura sınırı kaç TL?" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5">
          <Send className="w-4 h-4" /> Sor
        </button>
      </form>
    </div>
  );
}
