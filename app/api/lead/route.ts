import { NextResponse } from 'next/server';
import { isLeadTopic } from '@/lib/lead-topics';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const topic = body.topic;

    if (!name || !phone || !isLeadTopic(topic)) {
      return NextResponse.json({ success: false, error: "Ad, telefon ve konu gerekli." }, { status: 400 });
    }

    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json({ success: false, error: "Bir hata oluştu." }, { status: 500 });
    }

    const tarih = new Intl.DateTimeFormat("tr-TR", {
      timeZone: "Europe/Istanbul",
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date());

    const sheetResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "Ad Soyad": name,
        "Telefon": phone,
        "Ne istiyor": topic,
        "Tarih": tarih,
      }),
    });

    if (!sheetResponse.ok) {
      return NextResponse.json({ success: false, error: "Bir hata oluştu." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Lead kaydedildi." });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Bir hata oluştu." }, { status: 500 });
  }
}
