import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone } = body;

    const GOOGLE_SHEET_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    if (GOOGLE_SHEET_WEBHOOK_URL) {
      await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, date: new Date().toISOString() }),
      });
    }

    return NextResponse.json({ success: true, message: "Lead kaydedildi." });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Bir hata oluştu." }, { status: 500 });
  }
}
