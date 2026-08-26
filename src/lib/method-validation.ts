/**
 * Last time we checked stored XP/GP against the linked wiki/MMG.
 * Only `VALIDATED` ids get a green/yellow date.
 * Every other method was attempted in the 2026-08-26 sweep and stays red.
 */

export type MethodValidation = {
  checkedAt: string;
};

const SWEEP_DATE = "2026-08-26";

/** Prefixes whose XP/action and actions/h match the named training page. */
const VALIDATED_PREFIXES: { prefix: string; except?: string[] }[] = [
  { prefix: "burn-", except: ["burn-rosewood", "burn-ironwood"] },
  { prefix: "campfire-", except: ["campfire-rosewood", "campfire-ironwood"] },
];

/**
 * Successful match (or fix-then-match) against the linked guide.
 * GP/h that is live GE is validated on the *model* (inputs/outputs/actions),
 * not on today's gold number.
 */
const VALIDATED: Record<string, MethodValidation> = {
  "redwood-pyre": { checkedAt: SWEEP_DATE },
  "wintertodt-mass": { checkedAt: SWEEP_DATE },
  "sunfire-runes": { checkedAt: SWEEP_DATE },
  "sepulchre-floor-5-loot": { checkedAt: SWEEP_DATE },

  "varrock-rooftop": { checkedAt: SWEEP_DATE },
  "canifis-rooftop": { checkedAt: SWEEP_DATE },
  "falador-rooftop": { checkedAt: SWEEP_DATE },
  "seers-rooftop": { checkedAt: SWEEP_DATE },
  "pollnivneach-rooftop": { checkedAt: SWEEP_DATE },
  "relekka-rooftop": { checkedAt: SWEEP_DATE },
  "ardougne-rooftop": { checkedAt: SWEEP_DATE },
  "colossal-wyrm-basic": { checkedAt: SWEEP_DATE },
  "colossal-wyrm-advanced": { checkedAt: SWEEP_DATE },
  "wilderness-agility": { checkedAt: SWEEP_DATE },
  "werewolf": { checkedAt: SWEEP_DATE },
  "prifddinas": { checkedAt: SWEEP_DATE },
  "ape-atoll": { checkedAt: SWEEP_DATE },

  wine: { checkedAt: SWEEP_DATE },
  karambwan: { checkedAt: SWEEP_DATE },
  "karambwan-1tick": { checkedAt: SWEEP_DATE },
  shark: { checkedAt: SWEEP_DATE },
  anglerfish: { checkedAt: SWEEP_DATE },
  tuna: { checkedAt: SWEEP_DATE },
  lobster: { checkedAt: SWEEP_DATE },
  swordfish: { checkedAt: SWEEP_DATE },
  monkfish: { checkedAt: SWEEP_DATE },
  "dark-crab": { checkedAt: SWEEP_DATE },
  "manta-ray": { checkedAt: SWEEP_DATE },
};

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
