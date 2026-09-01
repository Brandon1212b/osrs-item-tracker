import type { ActivityMethod } from "@/lib/activity-methods";

export type MethodPart = { name: string; qty: number; isSecondary?: boolean };

export type SkillingMethod = {
  id: string;
  label: string;
  level: number;
  xp: number;
  actionsPerHour: number;
  inputs: MethodPart[];
  output: MethodPart | null;
  outputs?: MethodPart[];
  intensity?: "low" | "medium" | "high";
  /** Optional Magic level (e.g. ensouled heads, offering spells) */
  magicLevel?: number;
};

export type RankedMethod = {
  id: string;
  label: string;
  level: number;
  xpPerHour: number;
  gpPerHour: number | null;
  profitPerCraft: number | null;
  netChangePct: number | null;
  costPerXp: number | null;
  netValuePerHour: number | null;
  dominatedBy?: string | null;
  missing: boolean;
  locked: boolean;
  method?: SkillingMethod;
  activity?: ActivityMethod;
  secondaryLine?: string | null;
  notes?: string | null;
  intensity?: "low" | "medium" | "high" | null;
  rateBandLevel?: number | null;
  category: string;
  hoursToTarget?: number | null;
  totalGp?: number | null;
};
