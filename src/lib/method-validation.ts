/**
 * Last time we checked stored XP against the linked wiki training / MMG page.
 * Only listed ids/prefixes get green. Everything else: Not validated as of SWEEP_DATE.
 */

export type MethodValidation = {
  checkedAt: string;
};

const SWEEP_DATE = "2026-08-26";

const VALIDATED_PREFIXES: { prefix: string; except?: string[] }[] = [
  { prefix: "burn-", except: ["burn-rosewood", "burn-ironwood"] },
  { prefix: "campfire-", except: ["campfire-rosewood", "campfire-ironwood"] },
  { prefix: "clean-" },
  { prefix: "degrime-" },
  { prefix: "birdhouse-" },
  { prefix: "divine-" },
];

const VALIDATED_IDS = [
  "redwood-pyre",
  "wintertodt-mass",
  "sunfire-runes",
  "sepulchre-floor-5-loot",
  "varrock-rooftop",
  "canifis-rooftop",
  "falador-rooftop",
  "seers-rooftop",
  "pollnivneach-rooftop",
  "relekka-rooftop",
  "ardougne-rooftop",
  "colossal-wyrm-basic",
  "colossal-wyrm-advanced",
  "wilderness-agility",
  "werewolf",
  "prifddinas",
  "ape-atoll",
  "wine",
  "karambwan",
  "karambwan-1tick",
  "shark",
  "anglerfish",
  "tuna",
  "lobster",
  "swordfish",
  "monkfish",
  "dark-crab",
  "manta-ray",
  "shrimp",
  "trout",
  "salmon",
  "leechfin",
  "minnows",
  "sacred-eel",
  "infernal-eel",
  "barbarian-fishing",
  "drift-net",
  "iron-ore",
  "amethyst",
  "granite-3tick",
  "gem-rock",
  "infernal-shale",
  "teak-logs",
  "sulliusceps",
  "blisterwood",
  "bloodwood",
  "engorged-bloodwood",
  "redwood-logs",
  "rosewood-logs",
  "stealing-artefacts",
  "pyramid-plunder",
  "blackjacking",
  "elves",
  "vyres",
  "master-farmers",
  "rogues-castle-medium",
  "rogues-castle-hard",
  "grey-chins",
  "red-chins",
  "black-chins",
  "herbiboar",
  "guthix-rest",
  "prayer-potion",
  "super-attack",
  "super-energy",
  "super-strength",
  "super-restore",
  "super-defence",
  "ranging-potion",
  "magic-potion",
  "stamina-potion",
  "saradomin-brew",
  "super-combat",
  "mahogany-table",
  "mythical-cape",
  "oak-larder",
  "gotr-mass",
  "motherlode-mine",
  "blast-mine",
  "volcanic-mine",
  "shooting-stars",
] as const;

const VALIDATED: Record<string, MethodValidation> = Object.fromEntries(
  VALIDATED_IDS.map((id) => [id, { checkedAt: SWEEP_DATE }]),
);

export type ValidationDisplay =
  | { status: "fresh" | "stale"; checkedAt: string; label: string }
  | { status: "none"; checkedAt: null; label: string };

const MS_DAY = 86_400_000;
const FRESH_DAYS = 30;

function lookupValidated(methodId: string): MethodValidation | undefined {
  const exact = VALIDATED[methodId];
  if (exact) return exact;
  for (const rule of VALIDATED_PREFIXES) {
    if (!methodId.startsWith(rule.prefix)) continue;
    if (rule.except?.includes(methodId)) return undefined;
    return { checkedAt: SWEEP_DATE };
  }
  return undefined;
}

export function getMethodValidation(methodId: string): ValidationDisplay {
  const entry = lookupValidated(methodId);
  if (!entry) {
    return {
      status: "none",
      checkedAt: null,
      label: `Not validated as of ${SWEEP_DATE}`,
    };
  }
  const checked = Date.parse(`${entry.checkedAt}T12:00:00Z`);
  const ageDays = (Date.now() - checked) / MS_DAY;
  if (ageDays <= FRESH_DAYS) {
    return {
      status: "fresh",
      checkedAt: entry.checkedAt,
      label: `Validated ${entry.checkedAt}`,
    };
  }
  return {
    status: "stale",
    checkedAt: entry.checkedAt,
    label: `Last validated ${entry.checkedAt}`,
  };
}
