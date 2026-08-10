/**
 * Hunter production methods (simple input→output).
 * Complex activities (Herbiboar) live in activity-methods.ts.
 * Expand with chins, birdhouses, etc. as GE-linked methods are added.
 */
export type MethodPart = { name: string; qty: number };

export type HunterMethod = {
  id: string;
  label: string;
  level: number;
  xp: number;
  actionsPerHour: number;
  inputs: MethodPart[];
  output: MethodPart | null;
};

/** Placeholder production list — activities carry most of the ranking for now. */
export const HUNTER_METHODS: HunterMethod[] = [];

export function hunterMethodItemNames(): string[] {
  const names = new Set<string>();
  for (const m of HUNTER_METHODS) {
    for (const p of m.inputs) names.add(p.name);
    if (m.output) names.add(m.output.name);
  }
  return [...names];
}
