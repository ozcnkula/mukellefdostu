export type SimulatorPreset = {
  label: string;
  gelir: number;
  personel?: number;
  ofis?: number;
  pazarlama?: number;
  arac?: number;
  dagitim?: number;
};

export function simulatorHref(preset: SimulatorPreset) {
  const params = new URLSearchParams();
  params.set("gelir", String(preset.gelir));
  const keys = ["personel", "ofis", "pazarlama", "arac", "dagitim"] as const;
  for (const key of keys) {
    const value = preset[key];
    if (value !== undefined) params.set(key, String(value));
  }
  return `/?${params.toString()}#hesaplayici`;
}
