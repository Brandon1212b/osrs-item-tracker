/** Player skill levels from OSRS Hiscores. Keys are lowercase skill names. */
export type PlayerSkills = Record<string, number>;

export type PlayerStats = {
  name: string;
  skills: PlayerSkills;
};

export const PLAYER_STORAGE_KEY = "ge-watch-player-rsn";

/** Canonical skill keys used by osrsreboxed equipment requirements + hiscores. */
export const SKILL_KEYS = [
  "attack",
  "defence",
  "strength",
  "hitpoints",
  "ranged",
  "prayer",
  "magic",
  "cooking",
  "woodcutting",
  "fletching",
  "fishing",
  "firemaking",
  "crafting",
  "smithing",
  "mining",
  "herblore",
  "agility",
  "thieving",
  "slayer",
  "farming",
  "runecraft",
  "hunter",
  "construction",
  "sailing",
] as const;

export type SkillKey = (typeof SKILL_KEYS)[number];

/** True if the player meets every listed requirement (missing skill = level 1). */
export function meetsRequirements(
  skills: PlayerSkills | null | undefined,
  requirements: Record<string, number> | null | undefined,
): boolean {
  if (!requirements || Object.keys(requirements).length === 0) return true;
  if (!skills) return true; // no player loaded → don't lock anything
  for (const [skill, need] of Object.entries(requirements)) {
    const have = skills[skill.toLowerCase()] ?? 1;
    if (have < need) return false;
  }
  return true;
}

/** Short label for the first failed requirement, e.g. "Attack 70". */
export function firstMissingRequirement(
  skills: PlayerSkills | null | undefined,
  requirements: Record<string, number> | null | undefined,
): string | null {
  if (!requirements || !skills) return null;
  for (const [skill, need] of Object.entries(requirements)) {
    const key = skill.toLowerCase();
    const have = skills[key] ?? 1;
    if (have < need) {
      const label = key.charAt(0).toUpperCase() + key.slice(1);
      return `${label} ${need}`;
    }
  }
  return null;
}
