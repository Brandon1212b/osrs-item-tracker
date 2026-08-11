/**
 * Mastering Mixology — Herblore activity (Children of the Sun / Varlamore).
 */
import type { ActivityMethod } from "@/lib/activity-methods";

export const MIXOLOGY_METHODS: ActivityMethod[] = [
  {
    id: "mastering-mixology",
    label: "Mastering Mixology",
    skillKey: "herblore",
    level: 60,
    rateBands: [
      { level: 60, xpPerHour: 45_000, expectedLootGpPerHour: 1_500_000 },
      { level: 81, xpPerHour: 70_000, expectedLootGpPerHour: 2_500_000 },
      { level: 90, xpPerHour: 75_000, expectedLootGpPerHour: 2_800_000 },
      { level: 99, xpPerHour: 80_000, expectedLootGpPerHour: 3_000_000 },
    ],
    consumables: [],
    rewards: [],
    intensity: "medium",
    notes:
      "Children of the Sun. Grind herbs to paste off-site. Digweed on Mixalot for double XP/resin. GP is resin→Aldarium EV (wiki MMG).",
  },
];
