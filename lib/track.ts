"use client";

import { track } from "@vercel/analytics";

const EVENTS = {
  simulator: "Simülatör kullanımı",
  checklist: "Checklist indirme",
  ai: "AI sorusu",
} as const;

export function trackEvent(event: keyof typeof EVENTS) {
  track(EVENTS[event]);
}
