"use server";

import { createHash, timingSafeEqual } from "crypto";

function sameSecret(left: string, right: string) {
  const a = createHash("sha256").update(left).digest();
  const b = createHash("sha256").update(right).digest();
  return timingSafeEqual(a, b);
}

function sheetLink(value: string | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname !== "docs.google.com") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export async function revealSheet(password: string): Promise<{ url?: string; error?: string }> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !sameSecret(password, expected)) {
    return { error: "Şifre yanlış." };
  }

  const url = sheetLink(process.env.GOOGLE_SHEETS_URL);
  if (!url) {
    return { error: "Sheets bağlantısı henüz tanımlı değil." };
  }

  return { url };
}
