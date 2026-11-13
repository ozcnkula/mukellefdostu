"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
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

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function compare(profit: number, distribution: number) {
  const ratio = clamp(distribution, 0, 100) / 100;
  const bagkur = round(BAGKUR_ANNUAL);
  const soleBase = Math.max(0, profit - bagkur - SOLE_ADMIN);
  const soleTax = round(incomeTax(soleBase));
  const soleNet = profit - bagkur - SOLE_ADMIN - soleTax;

  const ltdBase = Math.max(0, profit - LTD_ADMIN);
  const corporateTax = round(ltdBase * CORPORATE_RATE);
  const afterTax = ltdBase - corporateTax;
  const distributedGross = round(afterTax * ratio);
  const companyKeeps = afterTax - distributedGross;
  const withholding = round(distributedGross * DIVIDEND_WHT);
  const taxableHalf = distributedGross / 2;
  const filesReturn = taxableHalf > DIVIDEND_FILING_LIMIT;
  const assessed = filesReturn ? round(incomeTax(taxableHalf)) : 0;
  const extraTax = filesReturn ? Math.max(0, assessed - withholding) : 0;
  const dividendTax = withholding + extraTax;
  const partnerCash = distributedGross - dividendTax - bagkur;
  const ltdNet = companyKeeps + partnerCash;

  return {
    bagkur,
    soleTax,
    soleNet,
    corporateTax,
    distributedGross,
    companyKeeps,
    withholding,
    extraTax,
    filesReturn,
    dividendTax,
    partnerCash,
    ltdNet,
  };
}

function tl(amount: number) {
  return `${Math.round(amount).toLocaleString("tr-TR")} TL`;
}

function readAmount(params: URLSearchParams, key: string, max: number) {
  const raw = params.get(key);
  if (raw === null || raw === "") return null;
  return clamp(Number(raw), 0, max);
}

function readShareParams() {
  const params = new URLSearchParams(window.location.search);
  const dagitim = params.get("dagitim");
  const mod = params.get("mod");
  const distribution =
    dagitim !== null && dagitim !== ""
      ? clamp(Number(dagitim), 0, 100)
      : mod === "dagitim"
        ? 100
        : mod === "sirket"
          ? 0
          : null;
  const gelir = readAmount(params, "gelir", 12_000_000);
  const kar = readAmount(params, "kar", 12_000_000);

  if (gelir !== null) {
    return {
      revenue: gelir,
      staff: readAmount(params, "personel", 3_000_000) ?? 0,
      office: readAmount(params, "ofis", 3_000_000) ?? 0,
      marketing: readAmount(params, "pazarlama", 3_000_000) ?? 0,
      vehicle: readAmount(params, "arac", 3_000_000) ?? 0,
      distribution,
    };
  }

  if (kar !== null) {
    return { revenue: kar, staff: 0, office: 0, marketing: 0, vehicle: 0, distribution };
  }

  return { revenue: null, staff: null, office: null, marketing: null, vehicle: null, distribution };
}

function MoneySlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center justify-between gap-3 text-xs text-slate-400">
        <span>{label}</span>
        <span className="font-semibold text-slate-200">{tl(value)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full cursor-pointer accent-teal-500"
      />
    </label>
  );
}

export default function TaxCalculator() {
  const { setSimulator } = useSite();
  const [revenue, setRevenue] = useState(1_500_000);
  const [staff, setStaff] = useState(300_000);
  const [office, setOffice] = useState(100_000);
  const [marketing, setMarketing] = useState(50_000);
  const [vehicle, setVehicle] = useState(50_000);
  const [distribution, setDistribution] = useState(0);
  const [used, setUsed] = useState(false);
  const reportedUse = useRef(false);
  const [notice, setNotice] = useState("");
  const [quote, setQuote] = useState({ name: "", phone: "", email: "" });
  const [quoteState, setQuoteState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const expenses = staff + office + marketing + vehicle;
  const profit = Math.max(0, revenue - expenses);
  const result = compare(profit, distribution);
  const soleWins = result.soleNet >= result.ltdNet;
  const gap = Math.abs(result.soleNet - result.ltdNet);
  const winnerName = soleWins ? "Şahıs şirketi" : "Limited şirket";
  const senaryo = soleWins ? "sahis" : "ltd";

  const markUsed = () => setUsed(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = readShareParams();
      if (params.revenue !== null) setRevenue(params.revenue);
      if (params.staff !== null) setStaff(params.staff);
      if (params.office !== null) setOffice(params.office);
      if (params.marketing !== null) setMarketing(params.marketing);
      if (params.vehicle !== null) setVehicle(params.vehicle);
      if (params.distribution !== null) setDistribution(params.distribution);
      if (params.revenue !== null || params.distribution !== null) setUsed(true);
    }, 0);
    return () => window.clearTimeout(timer);
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
      distribution,
      soleNet: result.soleNet,
      ltdNet: result.ltdNet,
      winner: senaryo,
    });
  }, [used, profit, distribution, result.soleNet, result.ltdNet, senaryo, setSimulator]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 4500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const shareLink = `https://mukellefdostu.com/?gelir=${revenue}&personel=${staff}&ofis=${office}&pazarlama=${marketing}&arac=${vehicle}&kar=${profit}&senaryo=${senaryo}&dagitim=${distribution}`;

  const rememberShare = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("gelir", String(revenue));
    url.searchParams.set("personel", String(staff));
    url.searchParams.set("ofis", String(office));
    url.searchParams.set("pazarlama", String(marketing));
    url.searchParams.set("arac", String(vehicle));
    url.searchParams.set("kar", String(profit));
    url.searchParams.set("senaryo", senaryo);
    url.searchParams.set("dagitim", String(distribution));
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

  const sendQuote = async (event: FormEvent) => {
    event.preventDefault();
    setQuoteState("sending");
    setUsed(true);
    try {
      const response = await fetch("/api/teklif", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...quote,
          profit,
          advantage: gap,
          distribution,
          winner: senaryo,
        }),
      });
      setQuoteState(response.ok ? "sent" : "error");
    } catch {
      setQuoteState("error");
    }
  };

  return (
    <div id="hesaplayici" className="my-8 scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
          <Calculator className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">2026 Şahıs vs. Ltd. Vergi Simülatörü</h3>
          <p className="text-xs text-slate-400">Geliri ve gideri kaydırın. Vergi öncesi kâr kendiliğinden çıkar.</p>
        </div>
      </div>

      <div className="space-y-6">
        <MoneySlider
          label="Yıllık brüt gelir"
          value={revenue}
          min={0}
          max={12_000_000}
          step={50_000}
          onChange={(value) => {
            markUsed();
            setRevenue(value);
          }}
        />

        <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:grid-cols-2">
          <MoneySlider label="Personel maliyetleri" value={staff} min={0} max={3_000_000} step={10_000} onChange={(value) => { markUsed(); setStaff(value); }} />
          <MoneySlider label="Ofis kirası / giderleri" value={office} min={0} max={3_000_000} step={10_000} onChange={(value) => { markUsed(); setOffice(value); }} />
          <MoneySlider label="Pazarlama / reklam" value={marketing} min={0} max={3_000_000} step={10_000} onChange={(value) => { markUsed(); setMarketing(value); }} />
          <MoneySlider label="Araç / ulaşım" value={vehicle} min={0} max={3_000_000} step={10_000} onChange={(value) => { markUsed(); setVehicle(value); }} />
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-teal-800 bg-teal-950/40 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-teal-100">Vergi öncesi kâr</p>
            <p className="text-xs text-teal-200/80">
              {expenses > revenue ? "Giderler geliri aşıyor, kâr sıfır kabul edildi." : "Brüt gelirden giderler düşüldü."}
            </p>
          </div>
          <p className="text-lg font-extrabold text-white">{tl(profit)}</p>
        </div>

        <div>
          <div className="mb-2 flex justify-between gap-4 text-sm">
            <span className="text-slate-300">Limited kârının dağıtılan kısmı</span>
            <span className="font-bold text-blue-400">%{distribution}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={distribution}
            aria-label="Dağıtılacak kâr oranı"
            onChange={(event) => {
              markUsed();
              setDistribution(Number(event.target.value));
            }}
            className="w-full cursor-pointer accent-blue-600"
          />
          <p className="mt-2 text-xs text-slate-500">%0 şirkette kalır. %100 ortağa dağıtılır. Ara oranlar ikisini birden gösterir.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className={`rounded-xl border p-5 ${soleWins ? "border-blue-500/50 bg-blue-950/30" : "border-slate-800 bg-slate-950"}`}>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Şahıs şirketi net kazanç</span>
            <div className="mt-1 text-2xl font-extrabold text-white">{tl(result.soleNet)}</div>
            <dl className="mt-4 space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between gap-3"><dt>Bağ-Kur (asgari, indirimli)</dt><dd>{tl(result.bagkur)}</dd></div>
              <div className="flex justify-between gap-3"><dt>Örnek muhasebe ve oda gideri</dt><dd>{tl(SOLE_ADMIN)}</dd></div>
              <div className="flex justify-between gap-3"><dt>Gelir vergisi</dt><dd>{tl(result.soleTax)}</dd></div>
            </dl>
          </div>

          <div className={`rounded-xl border p-5 ${soleWins ? "border-slate-800 bg-slate-950" : "border-indigo-500/50 bg-indigo-950/30"}`}>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Limited, şirket + ortağın cebi</span>
            <div className="mt-1 text-2xl font-extrabold text-white">{tl(result.ltdNet)}</div>
            <dl className="mt-4 space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between gap-3"><dt>Örnek muhasebe ve yasal gider</dt><dd>{tl(LTD_ADMIN)}</dd></div>
              <div className="flex justify-between gap-3"><dt>Kurumlar vergisi (%25)</dt><dd>{tl(result.corporateTax)}</dd></div>
              <div className="flex justify-between gap-3"><dt>Şirkette kalan</dt><dd>{tl(result.companyKeeps)}</dd></div>
              <div className="flex justify-between gap-3"><dt>Kâr payı stopajı (%15)</dt><dd>{distribution === 0 ? "Dağıtılmadı" : tl(result.withholding)}</dd></div>
              <div className="flex justify-between gap-3"><dt>Beyanda ek vergi</dt><dd>{result.extraTax > 0 ? tl(result.extraTax) : "Yok"}</dd></div>
              <div className="flex justify-between gap-3"><dt>Ortağın Bağ-Kur primi</dt><dd>{tl(result.bagkur)}</dd></div>
              <div className="flex justify-between gap-3"><dt>Ortağın cebine giren</dt><dd>{tl(result.partnerCash)}</dd></div>
            </dl>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-blue-900/50 bg-blue-950/30 p-4 text-sm text-blue-300">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
          <span>
            <strong>
              {winnerName} bu seçimde yaklaşık {tl(gap)} daha fazla bırakıyor.
            </strong>{" "}
            {distribution === 0
              ? "Kâr şirkette kalırsa kâr payı vergisi doğmaz. Şahıs tarafında aynı kâr, Bağ-Kur ve örnek idari giderden sonra artan oranlı gelir vergisine girer."
              : "Dağıtılan kâr payında %15 stopaj kesilir. Beyan gereken kısımda stopaj, hesaplanan vergiden düşülür. Dağıtılmayan kısım şirkette kalır."}
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

        <form onSubmit={sendQuote} className="space-y-4 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5">
          <div>
            <h4 className="font-semibold text-white">Bu hesaplama için uzman desteği al</h4>
            <p className="mt-1 text-xs text-slate-400">Teklif isteyin. Yıllık kâr, senaryo ve avantaj tutarı da iletilir.</p>
          </div>
          {quoteState === "sent" ? (
            <p className="rounded-lg border border-emerald-800 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-200">
              Talebiniz alındı. En kısa sürede sizi arayacağız.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <label className="block text-xs text-slate-400">
                  Ad
                  <input
                    required
                    autoComplete="name"
                    value={quote.name}
                    onChange={(event) => setQuote({ ...quote, name: event.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                  />
                </label>
                <label className="block text-xs text-slate-400">
                  Telefon
                  <input
                    required
                    type="tel"
                    autoComplete="tel"
                    value={quote.phone}
                    onChange={(event) => setQuote({ ...quote, phone: event.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                  />
                </label>
                <label className="block text-xs text-slate-400">
                  E-posta
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={quote.email}
                    onChange={(event) => setQuote({ ...quote, email: event.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                  />
                </label>
              </div>
              {quoteState === "error" ? <p className="text-sm text-red-400">Talep gönderilemedi. Lütfen tekrar deneyin.</p> : null}
              <button
                type="submit"
                disabled={quoteState === "sending"}
                className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60 sm:w-auto sm:px-6"
              >
                {quoteState === "sending" ? "Gönderiliyor" : "Teklif iste"}
              </button>
            </>
          )}
        </form>

        <p className="text-[11px] leading-relaxed text-slate-500">
          Simülasyondur, bağlayıcı vergi hesabı değildir. Şahıs tarafında 2026 ücret dışı gelir tarifesi kullanılır
          (190.000 TL’ye kadar %15, 400.000 TL’ye kadar %20, 1.000.000 TL’ye kadar %27, 5.300.000 TL’ye kadar %35, fazlası %40).
          Bağ-Kur, 2026 asgari kazanç üzerinden 5 puan indirimli aylık 10.156,73 TL kabul edilmiştir. İdari giderler örnektir.
          Kurumlar vergisi %25’tir. Dağıtılan kâr payında %15 stopaj vardır. Beyan sınırını aşan yarıda stopaj mahsup edilir;
          stopaj beyan vergisinden yüksekse fark iade edilmez.
        </p>
      </div>
    </div>
  );
}
