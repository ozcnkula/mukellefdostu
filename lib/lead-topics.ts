export const LEAD_TOPICS = [
  "E-Fatura Danışmanlığı",
  "Vergi Simülasyonu Yorumu",
  "Sözleşme İncelemesi",
  "Genel Danışmanlık",
] as const;

export type LeadTopic = (typeof LEAD_TOPICS)[number];

export function isLeadTopic(value: unknown): value is LeadTopic {
  return typeof value === "string" && LEAD_TOPICS.includes(value as LeadTopic);
}
