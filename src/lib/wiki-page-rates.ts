/**
 * Hourly rates copied from the linked OSRS Wiki page on PULLED_AT.
 * Only fields that appear on that page are filled. Never invent a number.
 */

export const WIKI_RATES_PULLED_AT = "2026-08-28";

export type WikiSlotKey = "mmg" | "skillGuide" | "wiki";

export type WikiPageSnapshot = {
  pulledAt: string;
  xpPerHour?: number;
  xpPerHourMin?: number;
  xpPerHourMax?: number;
  gpPerHour?: number;
  note?: string;
};

export type MethodWikiSnapshots = Partial<Record<WikiSlotKey, WikiPageSnapshot>>;

const D = WIKI_RATES_PULLED_AT;

function mmg(xp?: number, gp?: number, note?: string): WikiPageSnapshot {
  return { pulledAt: D, ...(xp != null ? { xpPerHour: xp } : {}), ...(gp != null ? { gpPerHour: gp } : {}), ...(note ? { note } : {}) };
}

function range(min: number, max: number, note?: string): WikiPageSnapshot {
  return { pulledAt: D, xpPerHourMin: min, xpPerHourMax: max, ...(note ? { note } : {}) };
}

function point(xp: number, note?: string): WikiPageSnapshot {
  return { pulledAt: D, xpPerHour: xp, ...(note ? { note } : {}) };
}

/** Keys: method id, or `${skillKey}:${id}` when the same id exists in two skills. */
export const WIKI_PAGE_RATES: Record<string, MethodWikiSnapshots> = {
  "sunfire-runes": {
    mmg: mmg(30_690, 4_112_884, "MMG Results: 30,690 XP + 9,075 other; profit 4,112,884 after tax"),
  },
  "redwood-pyre": { mmg: mmg(28_000, 1_050_000) },
  "sepulchre-floor-5-loot": {
    mmg: mmg(88_060, 1_725_517, "MMG Results agility 88,060; profit 1,725,517 after tax"),
    skillGuide: range(85_800, 98_500, "Agility training: floor 5 85,800 (F4–F5 loot) to 98,500 (grand coffin)"),
  },
  "sepulchre-floor-4": {
    mmg: mmg(72_960, 967_492),
    skillGuide: point(79_700, "Agility training floor 4 grand coffin 79,700"),
  },
  "sepulchre-floor-3": {
    mmg: mmg(58_425, 669_691),
    skillGuide: point(68_900, "Agility training floor 3 grand coffin 68,900"),
  },
  "wilderness-agility-tickets": {
    mmg: mmg(47_426, 2_007_422),
    skillGuide: range(50_000, 60_000, "Agility training Wilderness 50k–60k"),
  },
  "yew-longbow": { mmg: mmg(180_000, 422_400) },
  "magic-longbow": { mmg: mmg(219_600, 357_600) },
  cannonballs: { mmg: mmg(15_360, 269_400, "600 bars / 2,400 balls; regular mould Results table") },
  "cannonballs-double": {
    mmg: mmg(30_720, 562_800, "Double mould text: up to 4,800 balls; profit band 506,520–562,800 at regular furnaces"),
  },
  "rune-2h": { mmg: mmg(202_500, 435_600, "900 items/h Results table") },
  "rune-platelegs": { mmg: mmg(202_500, 435_600) },
  "rune-plateskirt": { mmg: mmg(202_500, 435_600) },
  "rune-kiteshield": { mmg: mmg(202_500, 435_600) },
  "rune-battleaxe": { mmg: mmg(202_500, 435_600) },
  "rune-warhammer": { mmg: mmg(202_500, 435_600) },
  "bf-iron": { mmg: mmg(75_000, 354_450) },
  "bf-steel": { mmg: mmg(94_500, 1_712_250) },
  "bf-mithril": { mmg: mmg(108_000, 1_685_250) },
  "bf-adamant": { mmg: mmg(101_250, 2_106_450) },
  "bf-rune": { mmg: mmg(108_000, 2_337_612) },
  "astral-runes": { mmg: mmg(43_639, 1_722_607, "MMG lists 43,639 + 5,710 other XP") },
  "mud-runes": { mmg: mmg(98_800, 1_567_460) },
  "aether-runes": { mmg: mmg(93_000, 1_720_277, "MMG headline XP is 93,000 Crafting; also 7,041 / 750 other") },
  "lead-ore-deepfin": { mmg: mmg(72_900, 951_136) },
  basalt: { mmg: mmg(3_500, 739_200) },
  "zeah-salts": { mmg: mmg(5_000, 441_000) },
  "infernal-shale-afk": { mmg: mmg(9_860, 87_958, "MMG deposit (AFK) Results 9,860 XP; 221 crushed") },
  "infernal-shale-rocks": { mmg: mmg(35_960, 320_788, "MMG rocks (medium) Results 35,960 XP; 806 crushed") },
  "infernal-shale": { mmg: mmg(68_368, 827_840, "MMG tick manip Results 68,368 XP; 2,080 crushed") },
  amethyst: { mmg: mmg(21_600, 250_830, "MMG Results 21,600 XP; 80–100 ore/h") },
  "sunlight-antelope": { mmg: mmg(83_600, 1_270_638) },
  "moonlight-antelope": { mmg: mmg(90_000, 1_223_925) },
  "grey-chins": { mmg: mmg(44_775, 201_219) },
  "red-chins": { mmg: mmg(125_875, 665_874) },
  "black-chins": { mmg: mmg(94_500, 925_013) },
  "snowy-knights": { mmg: mmg(22_176, 1_231_702) },
  "pyre-foxes": { mmg: mmg(39_960, 905_603) },
  "rainbow-crabs-4trap": {
    mmg: mmg(122_000, 517_370, "Wiki 4-trap ~122,000 XP/h and ~517,370 profit (offcuts bought on GE)"),
    skillGuide: range(122_000, 122_000, "Crab trapping / Hunter training: 4 traps ~122k, static catch rate"),
  },
  "rainbow-crabs": {
    mmg: mmg(155_000, 636_111, "Wiki 5-trap 155,000 XP/h and 636,111 profit. Live MMG table currently models 740 crabs = 159,840 XP"),
    skillGuide: range(150_000, 160_000, "Crab trapping page: rainbow 150k–160k XP/h"),
  },
  elves: { mmg: mmg(197_848, 4_305_881) },
  vyres: { mmg: mmg(220_968, 2_488_345) },

  "cooking:shark": { mmg: mmg(273_000, 301_600, "Cooking raw sharks MMG") },
  "cooking:karambwan": { mmg: mmg(247_000, 200_200, "Cooking raw karambwan MMG 1,200/h") },
  "cooking:wine": { skillGuide: range(470_000, 490_000, "Cooking training jugs of wine") },
  wine: { skillGuide: range(470_000, 490_000, "Cooking training jugs of wine") },
  "karambwan-1tick": { skillGuide: range(464_000, 950_000, "Cooking training 1-tick karambwan table 30–99") },
  "cooking:anglerfish": { skillGuide: range(305_000, 330_000, "Cooking training Hosidius anglerfish") },
  "cooking:tuna": { skillGuide: range(85_000, 143_500, "Cooking training tuna") },
  "cooking:lobster": { skillGuide: range(120_000, 172_000, "Cooking training lobster") },
  "cooking:swordfish": { skillGuide: range(165_000, 200_900, "Cooking training swordfish") },
  "cooking:monkfish": { skillGuide: range(165_000, 215_200, "Cooking training monkfish") },
  "cooking:manta-ray": { skillGuide: range(285_000, 310_000, "Cooking training manta ray") },

  "cut-sapphire": { skillGuide: point(139_000, "Crafting training gem table, 2,780/h") },
  "cut-emerald": { skillGuide: point(187_650, "Crafting training gem table, 2,780/h") },
  "cut-ruby": { skillGuide: point(236_300, "Crafting training gem table, 2,780/h") },
  "cut-diamond": { skillGuide: point(298_850, "Crafting training gem table, 2,780/h") },
  "cut-dragonstone": { skillGuide: point(382_250, "Crafting training gem table, 2,780/h") },

  "varrock-rooftop": { skillGuide: range(11_000, 14_000) },
  "canifis-rooftop": { skillGuide: range(14_000, 17_000) },
  "falador-rooftop": { skillGuide: range(29_000, 34_000) },
  "seers-rooftop": { skillGuide: range(40_000, 56_000, "Agility training Seers 40k–44k no tele / 50k–56k with tele") },
  "pollnivneach-rooftop": { skillGuide: range(47_000, 58_000) },
  "relekka-rooftop": { skillGuide: range(50_000, 63_000) },
  "ardougne-rooftop": { skillGuide: range(66_000, 70_000) },
  "colossal-wyrm-basic": { skillGuide: point(31_000, "Agility training basic route up to 31,000") },
  "colossal-wyrm-advanced": { skillGuide: point(42_000, "Agility training advanced route up to 42,000") },
  "wilderness-agility": { skillGuide: range(50_000, 60_000) },
  "ape-atoll": { skillGuide: range(30_000, 55_000) },
  prifddinas: { skillGuide: range(60_000, 65_000) },

  "wintertodt-mass": {
    wiki: range(177_000, 350_000, "Wintertodt/Strategies first XP table 50=177k … 99=350k"),
    skillGuide: range(177_000, 350_000, "Wintertodt/Strategies first XP table"),
  },

  "teak-logs": { skillGuide: range(34_000, 93_000, "Woodcutting training teak no-tick 34k–93k") },
  "magic-logs": {
    mmg: mmg(32_500, 138_320),
    skillGuide: range(80_000, 90_000, "Woodcutting training magic 80k–90k with yews/forestry"),
  },
  "redwood-logs": {
    mmg: mmg(68_400, 148_010),
    skillGuide: range(55_000, 75_000, "Woodcutting training redwood 55k–75k"),
  },
  "ironwood-logs": { skillGuide: range(80_000, 110_000) },
  "rosewood-logs": { skillGuide: range(85_000, 90_000) },
  sulliusceps: { skillGuide: range(82_700, 105_000) },
  blisterwood: { skillGuide: range(69_000, 86_000) },
  bloodwood: { skillGuide: range(130_000, 210_000) },
};

export function getWikiSlotRates(
  methodId: string,
  slot: WikiSlotKey,
  skillKey?: string,
): WikiPageSnapshot | undefined {
  if (skillKey) {
    const keyed = WIKI_PAGE_RATES[`${skillKey}:${methodId}`]?.[slot];
    if (keyed) return keyed;
  }
  return WIKI_PAGE_RATES[methodId]?.[slot];
}

const TOLERANCE = 0.1;

function closeTo(site: number, wiki: number): boolean {
  if (!Number.isFinite(site) || !Number.isFinite(wiki)) return false;
  if (site === 0 && wiki === 0) return true;
  const denom = Math.abs(site);
  if (denom < 1) return Math.abs(wiki - site) <= 1;
  return Math.abs(wiki - site) / denom <= TOLERANCE;
}

export function wikiXpMatchesSite(snap: WikiPageSnapshot, siteXp: number): boolean | null {
  if (snap.xpPerHour != null) return closeTo(siteXp, snap.xpPerHour);
  if (snap.xpPerHourMin != null && snap.xpPerHourMax != null) {
    const lo = snap.xpPerHourMin;
    const hi = snap.xpPerHourMax;
    if (siteXp >= lo && siteXp <= hi) return true;
    return closeTo(siteXp, lo) || closeTo(siteXp, hi);
  }
  return null;
}

export function wikiGpMatchesSite(snap: WikiPageSnapshot, siteGp: number | null): boolean | null {
  if (snap.gpPerHour == null) return null;
  if (siteGp == null || !Number.isFinite(siteGp)) return null;
  return closeTo(siteGp, snap.gpPerHour);
}

export function formatWikiXp(snap: WikiPageSnapshot): string | null {
  if (snap.xpPerHour != null) return Math.round(snap.xpPerHour).toLocaleString();
  if (snap.xpPerHourMin != null && snap.xpPerHourMax != null) {
    return `${Math.round(snap.xpPerHourMin).toLocaleString()}–${Math.round(snap.xpPerHourMax).toLocaleString()}`;
  }
  return null;
}
