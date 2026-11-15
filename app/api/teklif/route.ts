import { NextResponse } from "next/server";
import { isMatchFocus } from "@/lib/match-focus";
import { NACE_CODES } from "@/lib/nace-codes";

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
    let phone = clean(body.phone, 30);
    let email = clean(body.email, 120);
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const tarih = new Intl.DateTimeFormat("tr-TR", {
      timeZone: "Europe/Istanbul",
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date());

    let heading = "";
    let detail = "";
    let sheetTopic = "";

    if (body.kind === "eslestirme") {
      const contact = clean(body.contact, 120);
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
      const phoneOk = contact.replace(/\D/g, "").length >= 10;
      const focus = isMatchFocus(body.focus) ? body.focus : "";
      const revenue = inRange(body.revenue, 0, 12_000_000);
      const staff = inRange(body.staff, 0, 3_000_000);
      const office = inRange(body.office, 0, 3_000_000);
      const marketing = inRange(body.marketing, 0, 3_000_000);
      const vehicle = inRange(body.vehicle, 0, 3_000_000);
      const profit = inRange(body.profit, 0, 20_000_000);
      const advantage = inRange(body.advantage, 0, 20_000_000);
      const distribution = inRange(body.distribution, 0, 100);
      const scenario = body.winner === "ltd" ? "Limited şirket" : body.winner === "sahis" ? "Şahıs şirketi" : "";

      if (!name) {
        return NextResponse.json({ success: false, error: "Ad soyad gerekli." }, { status: 400 });
      }
      if (!emailOk && !phoneOk) {
        return NextResponse.json({ success: false, error: "Geçerli bir e-posta veya telefon gerekli." }, { status: 400 });
      }
      if (!focus) {
        return NextResponse.json({ success: false, error: "Odak konusu seçin." }, { status: 400 });
      }
      if (body.consent !== true) {
        return NextResponse.json({ success: false, error: "Devam etmek için KVKK açık rızası gerekli." }, { status: 400 });
      }
      if (revenue === null || staff === null || office === null || marketing === null || vehicle === null || profit === null || advantage === null || distribution === null || !scenario) {
        return NextResponse.json({ success: false, error: "Simülatör özeti okunamadı. Sayfayı yenileyip yeniden deneyin." }, { status: 400 });
      }

      heading = "Yeni ön eşleştirme";
      detail = [
        `Odak: ${focus}`,
        "KVKK açık rıza: evet",
        `Gelir: ${money(revenue)}`,
        `Personel: ${money(staff)}`,
        `Ofis: ${money(office)}`,
        `Pazarlama: ${money(marketing)}`,
        `Araç: ${money(vehicle)}`,
        `Vergi öncesi kâr: ${money(profit)}`,
        `Dağıtım: %${distribution}`,
        `Öne çıkan: ${scenario}`,
        `Fark: ${money(advantage)}`,
      ].join("\n");
      sheetTopic = `Ön eşleştirme | ${focus} | ${scenario} | kâr ${money(profit)} | dağıtım %${distribution} | fark ${money(advantage)} | ${contact}`.slice(0, 450);
      phone = contact;
      email = emailOk ? contact : "";
    } else if (body.kind === "nace") {
      const code = clean(body.code, 12);
      const found = NACE_CODES.find((item) => item.code === code);
      if (!name || !phone || !emailOk || !found) {
        return NextResponse.json({ success: false, error: "Ad, telefon, e-posta ve NACE kodu gerekli." }, { status: 400 });
      }
      heading = "Yeni NACE kuruluş teklifi";
      detail = [`NACE kodu: ${found.code}`, `Açıklama: ${found.title}`].join("\n");
      sheetTopic = `Kuruluş | NACE ${found.code} ${found.title} | ${email}`;
    } else {
      const profit = inRange(body.profit, 0, 20_000_000);
      const advantage = inRange(body.advantage, 0, 20_000_000);
      const distribution = inRange(body.distribution, 0, 100);
      const scenario = body.winner === "ltd" ? "Limited şirket" : body.winner === "sahis" ? "Şahıs şirketi" : "";

      if (!name || !phone || !emailOk || profit === null || advantage === null || distribution === null || !scenario) {
        return NextResponse.json({ success: false, error: "Ad, telefon ve e-posta gerekli." }, { status: 400 });
      }

      const scenarioText = `${scenario}, kârın %${distribution}’i dağıtılıyor`;
      heading = "Yeni simülasyon teklifi";
      detail = [`Yıllık kâr: ${money(profit)}`, `Senaryo: ${scenarioText}`, `Avantaj tutarı: ${money(advantage)}`].join("\n");
      sheetTopic = `Teklif | ${scenarioText} | kâr ${money(profit)} | avantaj ${money(advantage)} | ${email}`;
    }

    const failed = body.kind === "eslestirme"
      ? "Kayıt iletilemedi. Birkaç dakika sonra yeniden deneyin."
      : "Bir hata oluştu.";
    const slackUrl = process.env.SLACK_WEBHOOK_URL;
    const sheetUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (!slackUrl && !sheetUrl) {
      return NextResponse.json({ success: false, error: failed }, { status: 500 });
    }

    const contactLine = body.kind === "eslestirme"
      ? `İletişim: ${phone}`
      : [`Telefon: ${phone}`, `E-posta: ${email}`].join("\n");

    if (slackUrl) {
      const slackResponse = await fetch(slackUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: [heading, `Ad Soyad: ${name}`, contactLine, detail].join("\n"),
        }),
      });
      if (!slackResponse.ok) {
        return NextResponse.json({ success: false, error: failed }, { status: 500 });
      }
    }

    if (sheetUrl) {
      const sheetResponse = await fetch(sheetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "Ad Soyad": name,
          "Telefon": phone,
          "Ne istiyor": sheetTopic,
          "Tarih": tarih,
        }),
      });
      if (!sheetResponse.ok) {
        return NextResponse.json({ success: false, error: failed }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Bir hata oluştu." }, { status: 500 });
  }
}
