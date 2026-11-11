"use client";

import { useEffect, useRef, useState } from "react";
import { Calculator, Copy, MessageCircle, ShieldCheck } from "lucide-react";
import { useSite } from "@/components/SiteProvider";
import { trackEvent } from "@/lib/track";

const BRACKETS = [
  { limit: 190_000, rate: 0.15 },
  { limit: 400_000, rate: 0.2 },
  { limit: 1_000_000, rate: 0.27 },
  { limit: 5_300_000, rate: 0.35 },
  { limit: Number.POSITIVE_INFINITY, rate: 0.4 },
] as const;

const BAGKUR_ANNUAL = 10_156.73 * 12;
const SOLE_ADMIN = 36_000;
const LTD_ADMIN = 72_000;
const CORPORATE_RATE = 0.25;
const DIVIDEND_WHT = 0.15;
const DIVIDEND_FILING_LIMIT = 400_000;

function incomeTax(base: number) {
  if (base <= 0) return 0;

  let tax = 0;
  let previous = 0;

  for (const bracket of BRACKETS) {
    const slice = Math.min(base, bracket.limit) - previous;
    if (slice > 0) tax += slice * bracket.rate;
    if (base <= bracket.limit) break;
    previous = bracket.limit;
  }

  return tax;
}

function round(amount: number) {
  return Math.round(amount);
}

function compare(profit: number) {
  const bagkur = round(BAGKUR_ANNUAL);
  const soleBase = Math.max(0, profit - bagkur - SOLE_ADMIN);
  const soleTax = round(incomeTax(soleBase));
  const soleNet = profit - bagkur - SOLE_ADMIN - soleTax;

  const ltdBase = Math.max(0, profit - LTD_ADMIN);
  const corporateTax = round(ltdBase * CORPORATE_RATE);
  const grossDividend = ltdBase - corporateTax;
  const filesReturn = grossDividend / 2 > DIVIDEND_FILING_LIMIT;
  const dividendTax = filesReturn
    ? round(incomeTax(grossDividend / 2))
    : round(grossDividend * DIVIDEND_WHT);
  const retained = profit - LTD_ADMIN - corporateTax - bagkur;
  const distributed = retained - dividendTax;

  return { bagkur, soleTax, soleNet, corporateTax, dividendTax, filesReturn, retained, distributed };
}

function tl(amount: number) {
  return `${Math.round(amount).toLocaleString("tr-TR")} TL`;
}

function readShareParams() {
  const params = new URLSearchParams(window.location.search);
  const kar = Number(params.get("kar"));
  const mod = params.get("mod");
  return {
    profit: Number.isFinite(kar) && kar >= 250_000 && kar <= 8_000_000 ? kar : null,
    distribute: mod === "dagitim" ? true : mod === "sirket" ? false : null,
  };
}

export default function TaxCalculator() {
  const { setSimulator } = useSite();
  const [profit, setProfit] = useState(1_000_000);
  const [distribute, setDistribute] = useState(false);
  const [used, setUsed] = useState(false);
  const reportedUse = useRef(false);
  const [notice, setNotice] = useState("");
  const result = compare(profit);
  const ltdNet = distribute ? result.distributed : result.retained;
  const soleWins = result.soleNet >= ltdNet;
  const gap = Math.abs(result.soleNet - ltdNet);
  const winnerName = soleWins ? "Şahıs şirketi" : "Limited şirket";
  const senaryo = soleWins ? "sahis" : "ltd";

  useEffect(() => {
    const params = readShareParams();
    if (params.profit !== null) setProfit(params.profit);
    if (params.distribute !== null) setDistribute(params.distribute);
    if (params.profit !== null || params.distribute !== null) setUsed(true);
  }, []);

  useEffect(() => {
    if (!used || reportedUse.current) return;
    reportedUse.current = true;
    trackEvent("simulator");
  }, [used]);

  useEffect(() => {
    if (!used) return;
    setSimulator({
      profit,
      distribute,
      soleNet: result.soleNet,
      ltdNet,
      winner: senaryo,
    });
  }, [used, profit, distribute, result.soleNet, ltdNet, senaryo, setSimulator]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 4500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const shareLink = `https://mukellefdostu.com/?kar=${profit}&senaryo=${senaryo}&mod=${distribute ? "dagitim" : "sirket"}`;

  const rememberShare = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("kar", String(profit));
    url.searchParams.set("senaryo", senaryo);
    url.searchParams.set("mod", distribute ? "dagitim" : "sirket");
    window.history.replaceState(null, "", url);
    setUsed(true);
    setNotice("Paylaşıldı! İstersen AI asistanla sonucu yorumlayabilirsin.");
  };

  const shareWhatsApp = () => {
    const message = `2026 Şahıs vs Ltd vergi karşılaştırması yaptım. Yıllık ${profit.toLocaleString("tr-TR")} TL kârda ${winnerName} daha avantajlı görünüyor. Detaylar için: https://mukellefdostu.com`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    rememberShare();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
    } catch {
      const field = document.createElement("textarea");
      field.value = shareLink;
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    rememberShare();
  };

  return (
    <div id="hesaplayici" className="scroll-mt-24 bg-slate-900 border border-slate-800 rounded-2xl p-8 my-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">2026 Şahıs vs. Ltd. Vergi Simülatörü</h3>
          <p className="text-xs text-slate-400">
            Vergi öncesi yıllık kârı kaydırın. Hesap, 2026 gelir vergisi dilimlerini ve %25 kurumlar vergisini kullanır.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-2 gap-4">
            <span className="text-slate-300">Yıllık vergi öncesi kâr</span>
            <span className="text-blue-400 font-bold">{tl(profit)}</span>
          </div>
          <input
            type="range"
            min={250_000}
            max={8_000_000}
            step={50_000}
            value={profit}
            aria-label="Yıllık vergi öncesi kâr"
            onChange={(event) => {
              setUsed(true);
              setProfit(Number(event.target.value));
            }}
            className="w-full accent-blue-600 bg-slate-950 cursor-pointer"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {BRACKETS.slice(0, 4).map((bracket) => (
              <span
                key={bracket.limit}
                className="rounded-md border border-slate-800 bg-slate-950 px-2 py-1 text-[11px] text-slate-400"
              >
                {bracket.limit.toLocaleString("tr-TR")} TL’ye kadar %{bracket.rate * 100}
              </span>
            ))}
            <span className="rounded-md border border-slate-800 bg-slate-950 px-2 py-1 text-[11px] text-slate-400">
              Üzeri %40
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-950 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setUsed(true);
              setDistribute(false);
            }}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              distribute ? "text-slate-400 hover:text-slate-200" : "bg-indigo-600 text-white"
            }`}
          >
            Kâr şirkette kalsın
          </button>
          <button
            type="button"
            onClick={() => {
              setUsed(true);
              setDistribute(true);
            }}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              distribute ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Kârın tamamı dağıtılsın
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`rounded-xl border p-5 ${soleWins ? "border-blue-500/50 bg-blue-950/30" : "border-slate-800 bg-slate-950"}`}>
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Şahıs şirketi net kazanç</span>
            <div className="mt-1 text-2xl font-extrabold text-white">{tl(result.soleNet)}</div>
            <dl className="mt-4 space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between gap-3"><dt>Bağ-Kur (asgari, indirimli)</dt><dd>{tl(result.bagkur)}</dd></div>
              <div className="flex justify-between gap-3"><dt>Örnek muhasebe ve oda gideri</dt><dd>{tl(SOLE_ADMIN)}</dd></div>
              <div className="flex justify-between gap-3"><dt>Gelir vergisi</dt><dd>{tl(result.soleTax)}</dd></div>
            </dl>
          </div>

          <div className={`rounded-xl border p-5 ${soleWins ? "border-slate-800 bg-slate-950" : "border-indigo-500/50 bg-indigo-950/30"}`}>
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              {distribute ? "Limited, ortağa dağıtılan net" : "Limited, şirkette kalan net"}
            </span>
            <div className="mt-1 text-2xl font-extrabold text-white">{tl(ltdNet)}</div>
            <dl className="mt-4 space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between gap-3"><dt>Örnek muhasebe ve yasal gider</dt><dd>{tl(LTD_ADMIN)}</dd></div>
              <div className="flex justify-between gap-3"><dt>Kurumlar vergisi (%25)</dt><dd>{tl(result.corporateTax)}</dd></div>
              <div className="flex justify-between gap-3">
                <dt>{result.filesReturn ? "Kâr payı vergisi (beyan)" : "Kâr payı stopajı (%15)"}</dt>
                <dd>{distribute ? tl(result.dividendTax) : "Dağıtılmadı"}</dd>
              </div>
              <div className="flex justify-between gap-3"><dt>Ortağın Bağ-Kur primi</dt><dd>{tl(result.bagkur)}</dd></div>
            </dl>
          </div>
        </div>

        <div className="bg-blue-950/30 border border-blue-900/50 p-4 rounded-xl flex items-start gap-3 text-sm text-blue-300">
          <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <span>
            <strong>
              {soleWins ? "Şahıs şirketi" : "Limited şirket"} bu seçimde yaklaşık {tl(gap)} daha fazla bırakıyor.
            </strong>{" "}
            {distribute
              ? "Dağıtılan kâr payında önce %15 stopaj kesilir. İstisna sonrası tutar 400.000 TL’yi aşarsa yıllık beyanda kâr payının yarısı vergi dışı kalır ve stopaj mahsup edilir."
              : "Kâr şirkette bırakılırsa kâr payı vergisi doğmaz. Şahıs tarafında aynı kâr, Bağ-Kur ve örnek idari gider düşüldükten sonra artan oranlı gelir vergisine girer."}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={shareWhatsApp}
            className="flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-500"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp’ta Paylaş
          </button>
          <button
            type="button"
            onClick={copyLink}
            className="flex items-center justify-center gap-2 rounded-lg border border-blue-700 bg-blue-950/40 px-4 py-2.5 text-sm font-semibold text-blue-100 transition hover:border-teal-500"
          >
            <Copy className="h-4 w-4" /> Linki Kopyala
          </button>
        </div>
        {notice ? (
          <p role="status" className="rounded-lg border border-teal-800 bg-teal-950/40 px-3 py-2 text-sm text-teal-100">
            {notice}
          </p>
        ) : null}

        <p className="text-[11px] leading-relaxed text-slate-500">
          Simülasyondur, bağlayıcı vergi hesabı değildir. Şahıs tarafında 2026 ücret dışı gelir tarifesi kullanılır
          (190.000 TL’ye kadar %15, 400.000 TL’ye kadar %20, 1.000.000 TL’ye kadar %27, 5.300.000 TL’ye kadar %35, fazlası %40).
          Bağ-Kur, 2026 asgari kazanç üzerinden 5 puan indirimli aylık 10.156,73 TL kabul edilmiştir. İdari giderler örnektir.
          Kurumlar vergisi %25’tir. Ücret bordrosu, teşvikler ve kârın kısmen dağıtılması bu sonuca dahil değildir.
        </p>
      </div>
    </div>
  );
}
