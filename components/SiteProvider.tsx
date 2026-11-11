"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type ProfileId = "yeni-girisimci" | "e-ticaret" | "freelancer" | "mikro-ihracat";

export const PROFILE_LABELS: Record<ProfileId, string> = {
  "yeni-girisimci": "Yeni Girişimci",
  "e-ticaret": "E-Ticaret Satıcısı",
  freelancer: "Freelancer & Yazılımcı",
  "mikro-ihracat": "Mikro İhracatçı",
};

export type SimulatorSnapshot = {
  profit: number;
  distribute: boolean;
  soleNet: number;
  ltdNet: number;
  winner: "sahis" | "ltd";
};

type SiteContextValue = {
  profileId: ProfileId | null;
  setProfileId: (id: ProfileId | null) => void;
  simulator: SimulatorSnapshot | null;
  setSimulator: (value: SimulatorSnapshot) => void;
};

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [profileId, setProfileId] = useState<ProfileId | null>(null);
  const [simulator, setSimulatorState] = useState<SimulatorSnapshot | null>(null);
  const setSimulator = useCallback((value: SimulatorSnapshot) => {
    setSimulatorState(value);
  }, []);

  const value = useMemo(
    () => ({ profileId, setProfileId, simulator, setSimulator }),
    [profileId, simulator, setSimulator],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const value = useContext(SiteContext);
  if (!value) {
    throw new Error("useSite yalnızca SiteProvider içinde kullanılabilir.");
  }
  return value;
}
