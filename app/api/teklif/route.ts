import { NextResponse } from "next/server";

function money(value: number) {
  return `${Math.round(value).toLocaleString("tr-TR")} TL`;
}

function clean(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/[\r\n]+/g, " ").trim().slice(0, max);
}

function inRange(value: unknown, min: number, max: number) {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number) || number < min || number > max) return null;
  return Math.round(number);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = clean(body.name, 80);
    const phone = clean(body.phone, 30);
    const email = clean(body.email, 120);
    const profit = inRange(body.profit, 0, 20_000_000);
    const advantage = inRange(body.advantage, 0, 20_000_000);
    const distribution = inRange(body.distribution, 0, 100);
    const scenario = body.winner === "ltd" ? "Limited şirket" : body.winner === "sahis" ? "Şahıs şirketi" : "";

    if (!name || !phone || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || profit === null || advantage === null || distribution === null || !scenario) {
      return NextResponse.json({ success: false, error: "Ad, telefon ve e-posta gerekli." }, { status: 400 });
    }

    const scenarioText = `${scenario}, kârın %${distribution}’i dağıtılıyor`;
    const tarih = new Intl.DateTimeFormat("tr-TR", {
      timeZone: "Europe/Istanbul",
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date());

    const slackUrl = process.env.SLACK_WEBHOOK_URL;
    const sheetUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (!slackUrl && !sheetUrl) {
      return NextResponse.json({ success: false, error: "Bir hata oluştu." }, { status: 500 });
    }

    if (slackUrl) {
      const slackResponse = await fetch(slackUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: [
            "Yeni simülasyon teklifi",
            `Ad Soyad: ${name}`,
            `Telefon: ${phone}`,
            `E-posta: ${email}`,
            `Yıllık kâr: ${money(profit)}`,
            `Senaryo: ${scenarioText}`,
            `Avantaj tutarı: ${money(advantage)}`,
          ].join("\n"),
        }),
      });
      if (!slackResponse.ok) {
        return NextResponse.json({ success: false, error: "Bir hata oluştu." }, { status: 500 });
      }
    }

    if (sheetUrl) {
      const sheetResponse = await fetch(sheetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "Ad Soyad": name,
          "Telefon": phone,
          "Ne istiyor": `Teklif | ${scenarioText} | kâr ${money(profit)} | avantaj ${money(advantage)} | ${email}`,
          "Tarih": tarih,
        }),
      });
      if (!sheetResponse.ok) {
        return NextResponse.json({ success: false, error: "Bir hata oluştu." }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Bir hata oluştu." }, { status: 500 });
  }
}
