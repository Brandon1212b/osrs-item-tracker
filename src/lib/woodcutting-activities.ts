import type { ActivityMethod } from "@/lib/activity-methods";

/**
 * Teak = wiki no-tick-manipulation table.
 * Sulliusceps = wiki lumberjack table (crystal axe from 71).
 */
export const WOODCUTTING_RATE_TABLES: ActivityMethod[] = [
  {
    id: "teak-logs",
    label: "Teak logs (no tick manip)",
    skillKey: "woodcutting",
    level: 35,
    rateBands: [
      { level: 35, xpPerHour: 34_000 },
      { level: 41, xpPerHour: 42_000 },
      { level: 50, xpPerHour: 46_000 },
      { level: 61, xpPerHour: 65_000 },
      { level: 71, xpPerHour: 74_000 },
      { level: 80, xpPerHour: 80_000 },
      { level: 90, xpPerHour: 87_000 },
      { level: 99, xpPerHour: 93_000 },
    ],
    consumables: [],
    rewards: [{ name: "Teak logs", expectedQtyPerHour: 1 }],
    intensity: "medium",
    notes:
      "XP/h is the wiki no-tick teak table (regular → dragon felling → crystal felling). Not 1.5-tick or 2-tick. Forestry can add ~20k. Live GE logs/h = XP/h ÷ 85.",
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
      "Wiki sulliuscep table with lumberjack. Dragon axe at 65; crystal from 71. Fungi not modelled.",
  },
];
