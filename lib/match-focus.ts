export const MATCH_FOCI = ["Yeni Kuruluş", "Şahıs -> Limited", "E-Ticaret & Mevzuat"] as const;

export type MatchFocus = (typeof MATCH_FOCI)[number];

export function isMatchFocus(value: unknown): value is MatchFocus {
  return typeof value === "string" && MATCH_FOCI.includes(value as MatchFocus);
}
