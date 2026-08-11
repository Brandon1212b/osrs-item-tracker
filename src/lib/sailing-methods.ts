/**
 * Sailing training methods (P2P).
 * https://oldschool.runescape.wiki/w/Sailing_training
 *
 * Barracuda Trials (fastest XP) live in sailing-activity-methods.ts.
 * Most methods are pure XP (null output); courier tasks grant coins but rates vary
 * heavily by route — modelled as XP-focused with optional coin EV in notes.
 *
 * Rates: wiki focused / target-time bands (2026). Not tick-perfect maxima.
 */
export type MethodPart = { name: string; qty: number };

export type SailingMethod = {
  id: string;
  label: string;
  level: number;
  xp: number;
  actionsPerHour: number;
  inputs: MethodPart[];
  output: MethodPart | null;
};

export const SAILING_METHODS: SailingMethod[] = [
  // ── Early game ───────────────────────────────────────────────────────────
  {
    id: "courier-early",
    label: "Courier tasks (early ports)",
    level: 1,
    xp: 200, // average delivery XP scales with distance
    actionsPerHour: 50, // ~10k XP/hr with charting mixed in
    inputs: [],
    output: null,
  },
  {
    id: "sea-charting",
    label: "Sea charting",
    level: 1,
    xp: 150, // one-off tasks; effective rate from continuous charting
    actionsPerHour: 80, // ~12k XP/hr early; up to ~22k focused mid
    inputs: [],
    output: null,
  },

  // ── Courier routes (less intensive than Barracuda) ───────────────────────
  {
    id: "courier-summer-shore",
    label: "Courier — Summer Shore loop",
    level: 45,
    xp: 4000, // ~3–5k XP per delivery average
    actionsPerHour: 8, // ~30–32k XP/hr
    inputs: [],
    output: null,
  },
  {
    id: "courier-rellekka",
    label: "Courier — Rellekka / Etceteria",
    level: 62,
    xp: 5500,
    actionsPerHour: 12, // ~60–90k XP/hr depending on routes unlocked
    inputs: [],
    output: null,
  },
  {
    id: "courier-prifddinas",
    label: "Courier — Prifddinas / Tirannwn",
    level: 70,
    xp: 6000,
    actionsPerHour: 11, // ~65–70k XP/hr (Song of the Elves)
    inputs: [],
    output: null,
  },

  // ── Salvaging (AFK-leaning) ──────────────────────────────────────────────
  // XP/hr scaled after 2026 salvage balance; end-game AFK sits under Barracuda.
  {
    id: "salvage-small",
    label: "Salvaging — small shipwrecks",
    level: 15,
    xp: 10,
    actionsPerHour: 2000, // ~20k XP/hr focused
    inputs: [],
    output: null,
  },
  {
    id: "salvage-barracuda",
    label: "Salvaging — barracuda wrecks",
    level: 35,
    xp: 15.5,
    actionsPerHour: 2200, // ~34k XP/hr
    inputs: [],
    output: null,
  },
  {
    id: "salvage-large",
    label: "Salvaging — large shipwrecks",
    level: 53,
    xp: 24,
    actionsPerHour: 2200, // ~53k XP/hr
    inputs: [],
    output: null,
  },
  {
    id: "salvage-pirate",
    label: "Salvaging — pirate shipwrecks",
    level: 64,
    xp: 31.5,
    actionsPerHour: 2000, // ~63k XP/hr
    inputs: [],
    output: null,
  },
  {
    id: "salvage-endgame",
    label: "Salvaging — high-tier (AFK)",
    level: 80,
    xp: 34,
    actionsPerHour: 2400, // ~80–90k XP/hr post-balance target
    inputs: [],
    output: null,
  },
];

export function sailingMethodItemNames(): string[] {
  const names = new Set<string>();
  for (const m of SAILING_METHODS) {
    for (const p of m.inputs) names.add(p.name);
    if (m.output) names.add(m.output.name);
  }
  return [...names];
}
