import { createContext, useContext, type ReactNode } from "react";
import type { PlayerSkills } from "@/lib/player-stats";

export type MethodSkillsNav = {
  active: string;
  onSelect: (key: string) => void;
  levels?: PlayerSkills | null;
  enabledKeys?: ReadonlySet<string>;
};

const MethodSkillsNavContext = createContext<MethodSkillsNav | null>(null);

export function MethodSkillsNavProvider({
  value,
  children,
}: {
  value: MethodSkillsNav;
  children: ReactNode;
}) {
  return <MethodSkillsNavContext.Provider value={value}>{children}</MethodSkillsNavContext.Provider>;
}

export function useMethodSkillsNav() {
  return useContext(MethodSkillsNavContext);
}
