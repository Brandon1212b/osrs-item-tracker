import type { ActivityMethod } from "@/lib/activity-methods";

/**
 * Woodcutting methods whose wiki page publishes XP/h by level.
 * Teak = no tick-manipulation table on Pay-to-play Woodcutting training.
 * Log qty/h = band XP/h ÷ 85 so GP tracks the same band.
 */
export const WOODCUTTING_RATE_TABLES: ActivityMethod[] = [
  {
    id: "teak-logs",
    label: "Teak logs (no tick manip)",
    skillKey: "woodcutting",
    level: 35,
    rateBands: [
      { level: 35, xpPerHour: 34_000, outputQtyPerHour: 34_000 / 85 },
      { level: 41, xpPerHour: 42_000, outputQtyPerHour: 42_000 / 85 },
      { level: 50, xpPerHour: 46_000, outputQtyPerHour: 46_000 / 85 },
      { level: 61, xpPerHour: 65_000, outputQtyPerHour: 65_000 / 85 },
      { level: 71, xpPerHour: 74_000, outputQtyPerHour: 74_000 / 85 },
      { level: 80, xpPerHour: 80_000, outputQtyPerHour: 80_000 / 85 },
      { level: 90, xpPerHour: 87_000, outputQtyPerHour: 87_000 / 85 },
      { level: 99, xpPerHour: 93_000, outputQtyPerHour: 93_000 / 85 },
    ],
    consumables: [],
    rewards: [{ name: "Teak logs", expectedQtyPerHour: 1 }],
    intensity: "medium",
    notes:
      "XP/h is the wiki no-tick teak table (best regular axe → dragon felling → crystal felling). Not 1.5-tick (93–235k) or 2-tick (78–215k). Forestry events can add ~20k. Logs/h = XP/h ÷ 85.",
  },
  {
    id: "sulliusceps",
    label: "Sulliusceps",
    skillKey: "woodcutting",
    level: 65,
    rateBands: [
      { level: 65, xpPerHour: 82_700 },
      { level: 71, xpPerHour: 89_500 },
      { level: 80, xpPerHour: 94_800 },
      { level: 90, xpPerHour: 100_100 },
      { level: 99, xpPerHour: 105_000 },
    ],
    consumables: [],
    rewards: [],
    intensity: "medium",
    notes:
      "Wiki sulliuscep table with lumberjack. Dragon axe at 65; crystal axe from 71. Fungi not modelled as GE output.",
  },
];
