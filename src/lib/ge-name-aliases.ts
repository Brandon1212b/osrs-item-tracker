/** Catalog nicknames / incomplete names → exact wiki GE mapping names. */
export const GE_NAME_ALIASES: Record<string, string> = {
  "ursine chainmace": "Ursine chainmace (u)",
  "serpentine helm": "Serpentine helm (uncharged)",
  "warped sceptre": "Warped sceptre (uncharged)",
  "tome of fire": "Tome of Fire (empty)",
  "tome of water": "Tome of Water (empty)",
  "tome of earth": "Tome of Earth (empty)",
};

export function geLookupName(name: string): string {
  return GE_NAME_ALIASES[name.toLowerCase()] ?? name;
}
