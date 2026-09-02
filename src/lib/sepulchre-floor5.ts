import type { ActivityMethod } from "@/lib/activity-methods";

/**
 * https://oldschool.runescape.wiki/w/Money_making_guide/Hallowed_Sepulchre_(Floor_5)
 *
 * Wiki template: isperkill=y, kph=7, floors 4–5 coffins + grand coffin.
 * Per-run outputs are multiplied by 7 for hourly rates.
 */
const RUNS_PER_HOUR = 7;
const F4_COFFINS = 2;
const F5_COFFINS = 3;
const MED_COFFINS = F4_COFFINS * 0.6 + F5_COFFINS * 0.2; // 1.8 / run
const HIGH_COFFINS = F4_COFFINS * 0.4 + F5_COFFINS * 0.8 + 2; // 5.2 / run (grand chest = 2 high rolls)

function perHourFromRun(qtyPerRun: number): number {
  return qtyPerRun * RUNS_PER_HOUR;
}

export const SEPULCHRE_FLOOR_5: ActivityMethod = {
  id: "sepulchre-floor-5-loot",
  label: "Hallowed Sepulchre (Floor 5)",
  skillKey: "agility",
  secondarySkill: "thieving",
  level: 92,
  rateBands: [
    {
      level: 92,
      xpPerHour: 12_580 * RUNS_PER_HOUR, // 88,060
      secondaryXpPerHour: 1_200 * RUNS_PER_HOUR, // 8,400 Thieving
      // Hallowed marks are untradeable; wiki values 231 marks as 2.31 hallowed sacks.
      // Sack itself is also untradeable, so this residual is the wiki sack EV.
      expectedLootGpPerHour: 194_813,
    },
  ],
  consumables: [
    { name: "Mahogany plank", qty: 3 * RUNS_PER_HOUR },
    { name: "Rune nails", qty: 7.5 * RUNS_PER_HOUR },
    { name: "Vampyre dust", qty: 1 * RUNS_PER_HOUR },
  ],
  rewards: [
    {
      name: "Ring of endurance (uncharged)",
      expectedQtyPerHour: perHourFromRun(1 / 200),
    },
    {
      name: "Strange old lockpick (full)",
      expectedQtyPerHour: perHourFromRun(F4_COFFINS / 60 + F5_COFFINS / 40),
    },
    { name: "Adamant 2h sword", expectedQtyPerHour: perHourFromRun(MED_COFFINS * 0.1) },
    { name: "Adamant platebody", expectedQtyPerHour: perHourFromRun(MED_COFFINS * 0.1) },
    {
      name: "Cosmic rune",
      expectedQtyPerHour: perHourFromRun(MED_COFFINS * ((60 + 100) / 2) * 0.1),
    },
    {
      name: "Death rune",
      expectedQtyPerHour: perHourFromRun(MED_COFFINS * ((60 + 100) / 2) * 0.1),
    },
    {
      name: "Nature rune",
      expectedQtyPerHour: perHourFromRun(MED_COFFINS * ((60 + 100) / 2) * 0.1),
    },
    {
      name: "Adamant bolts",
      expectedQtyPerHour: perHourFromRun(MED_COFFINS * ((50 + 200) / 2) * 0.1),
    },
    {
      name: "Monkfish",
      expectedQtyPerHour: perHourFromRun(
        MED_COFFINS * ((1 + 3) / 2) * 0.1 + HIGH_COFFINS * ((2 + 6) / 2) * 0.1,
      ),
    },
    { name: "Prayer potion(4)", expectedQtyPerHour: perHourFromRun(MED_COFFINS * 0.1) },
    {
      name: "Grimy ranarr weed",
      expectedQtyPerHour: perHourFromRun(MED_COFFINS * ((1 + 2) / 2) * 0.1),
    },
    {
      name: "Coins",
      expectedQtyPerHour: perHourFromRun(
        MED_COFFINS * ((7_500 + 12_500) / 2) * 0.1 +
          HIGH_COFFINS * ((17_500 + 25_000) / 2) * 0.1,
      ),
    },
    { name: "Rune 2h sword", expectedQtyPerHour: perHourFromRun(HIGH_COFFINS * 0.1) },
    { name: "Rune platebody", expectedQtyPerHour: perHourFromRun(HIGH_COFFINS * 0.1) },
    {
      name: "Law rune",
      expectedQtyPerHour: perHourFromRun(HIGH_COFFINS * ((150 + 250) / 2) * 0.1),
    },
    {
      name: "Blood rune",
      expectedQtyPerHour: perHourFromRun(HIGH_COFFINS * ((150 + 250) / 2) * 0.1),
    },
    {
      name: "Soul rune",
      expectedQtyPerHour: perHourFromRun(HIGH_COFFINS * ((150 + 250) / 2) * 0.1),
    },
    {
      name: "Runite bolts",
      expectedQtyPerHour: perHourFromRun(HIGH_COFFINS * ((150 + 250) / 2) * 0.1),
    },
    {
      name: "Sanfew serum(4)",
      expectedQtyPerHour: perHourFromRun(HIGH_COFFINS * ((1 + 2) / 2) * 0.1),
    },
    {
      name: "Ranarr seed",
      expectedQtyPerHour: perHourFromRun(HIGH_COFFINS * ((1 + 2) / 2) * 0.1),
    },
  ],
  intensity: "high",
  notes:
    "Wiki MMG Floor 5, 7 runs/hr, F4+F5 coffins + grand coffin. Live GE on coffin loot minus planks/nails/dust. 231 hallowed marks/hr valued as sack EV (untradeable). Also ~1,400 Prayer / 2,100 Magic / 7,350 Construction XP/hr.",
};

export function sepulchreFloor5ItemNames(): string[] {
  const names = new Set<string>();
  for (const p of SEPULCHRE_FLOOR_5.consumables) names.add(p.name);
  for (const r of SEPULCHRE_FLOOR_5.rewards) names.add(r.name);
  return [...names];
}
