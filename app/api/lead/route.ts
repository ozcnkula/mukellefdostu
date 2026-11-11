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

    const GOOGLE_SHEET_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    if (GOOGLE_SHEET_WEBHOOK_URL) {
      await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, topic, date: new Date().toISOString() }),
      });
    }

    return NextResponse.json({ success: true, message: "Lead kaydedildi." });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Bir hata oluştu." }, { status: 500 });
  }
}
