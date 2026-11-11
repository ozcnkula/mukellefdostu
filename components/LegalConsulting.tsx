"use client";

import React, { useState } from "react";
import { Scale, FileText, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";

const LEGAL_SERVICES = [
  {
    title: "Mesafeli Satış Sözleşmeleri & İade Politikaları",
    desc: "2026 Tüketici Koruma Kanunu'na tam uyumlu e-ticaret sitenize özel sözleşme altyapısı.",
    tag: "Zorunlu Uyum"
  },
  {
    title: "KVKK & Gizlilik Politikaları",
    desc: "Müşteri verilerinin işlenmesi, açık rıza metinleri ve VERBİS kayıt danışmanlığı.",
    tag: "Yasal Güvence"
  },
  {
    title: "Pazaryeri Satıcı Sözleşme İncelemesi",
    desc: "Trendyol, Hepsiburada ve Amazon gibi platformlardaki haksız rekabet ve cezai şart maddelerinin analizi.",
    tag: "Risk Analizi"
  }
];

export default function LegalConsulting() {
  const [selectedService, setSelectedService] = useState(0);

  return (
    <div id="hukuk-danismanligi" className="bg-slate-900 border border-slate-800 rounded-2xl p-8 my-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-400">
          <Scale className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">E-Ticaret Hukuk & Uyum Merkezi</h3>
          <p className="text-xs text-slate-400">Cezai yaptırımlardan korunan güvenli e-ticaret altyapısı ve sözleşmeler.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {LEGAL_SERVICES.map((service, index) => (
          <div 
            key={index}
            onClick={() => setSelectedService(index)}
            className={`p-5 rounded-xl border transition cursor-pointer ${
              selectedService === index 
                ? "bg-indigo-950/40 border-indigo-500/50 text-white" 
                : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-900/40 text-indigo-300 border border-indigo-800/50">
                {service.tag}
              </span>
              <FileText className="w-4 h-4 text-indigo-400" />
            </div>
            <h4 className="font-semibold text-sm mb-1">{service.title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{service.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
          <div className="text-sm">
            <strong className="text-white block mb-0.5">2026 Dijital Ticaret Mevzuatı Denetimi</strong>
            <span className="text-slate-400 text-xs">E-ticaret sitenizi yasal risklere karşı avukat ortaklarımızla inceliyoruz.</span>
          </div>
        </div>
        <a href="#lead-form" className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition shrink-0">
          Hukuki İnceleme Talep Et
        </a>
      </div>
    </div>
  );
}
