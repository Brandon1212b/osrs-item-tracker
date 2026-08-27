/**
 * Fletching training methods (P2P).
 * Stringing longbows: MMG lists 2,400/h.
 */
export type MethodPart = { name: string; qty: number };

export type FletchingMethod = {
  id: string;
  label: string;
  level: number;
  xp: number;
  actionsPerHour: number;
  inputs: MethodPart[];
  output: MethodPart;
};

const DART_APH = 3000;
const DART_DRAGON_APH = 3500;
const BOLT_APH = 2500;
const BROAD_BOLT_APH = 3000;
const ARROW_APH = 2200;
const BROAD_ARROW_APH = 2500;
const GEM_TIP_APH = 2000;
const TIPPING_APH = 2700;
const BOW_U_APH = 1800;
const BOW_STRING_APH = 2400;

export const FLETCHING_METHODS: FletchingMethod[] = [
  { id: "maple-longbow-u", label: "Maple longbow (u)", level: 55, xp: 58.3, actionsPerHour: BOW_U_APH, inputs: [{ name: "Maple logs", qty: 1 }], output: { name: "Maple longbow (u)", qty: 1 } },
  { id: "maple-longbow", label: "String maple longbow", level: 55, xp: 58.3, actionsPerHour: BOW_STRING_APH, inputs: [{ name: "Maple longbow (u)", qty: 1 }, { name: "Bow string", qty: 1 }], output: { name: "Maple longbow", qty: 1 } },
  { id: "yew-longbow-u", label: "Yew longbow (u)", level: 70, xp: 75, actionsPerHour: BOW_U_APH, inputs: [{ name: "Yew logs", qty: 1 }], output: { name: "Yew longbow (u)", qty: 1 } },
  { id: "yew-longbow", label: "String yew longbow", level: 70, xp: 75, actionsPerHour: BOW_STRING_APH, inputs: [{ name: "Yew longbow (u)", qty: 1 }, { name: "Bow string", qty: 1 }], output: { name: "Yew longbow", qty: 1 } },
  { id: "magic-longbow-u", label: "Magic longbow (u)", level: 85, xp: 91.5, actionsPerHour: BOW_U_APH, inputs: [{ name: "Magic logs", qty: 1 }], output: { name: "Magic longbow (u)", qty: 1 } },
  { id: "magic-longbow", label: "String magic longbow", level: 85, xp: 91.5, actionsPerHour: BOW_STRING_APH, inputs: [{ name: "Magic longbow (u)", qty: 1 }, { name: "Bow string", qty: 1 }], output: { name: "Magic longbow", qty: 1 } },
  { id: "bronze-darts", label: "Bronze darts", level: 10, xp: 18, actionsPerHour: DART_APH, inputs: [{ name: "Bronze dart tip", qty: 10 }, { name: "Feather", qty: 10 }], output: { name: "Bronze dart", qty: 10 } },
  { id: "iron-darts", label: "Iron darts", level: 22, xp: 38, actionsPerHour: DART_APH, inputs: [{ name: "Iron dart tip", qty: 10 }, { name: "Feather", qty: 10 }], output: { name: "Iron dart", qty: 10 } },
  { id: "steel-darts", label: "Steel darts", level: 37, xp: 75, actionsPerHour: DART_APH, inputs: [{ name: "Steel dart tip", qty: 10 }, { name: "Feather", qty: 10 }], output: { name: "Steel dart", qty: 10 } },
  { id: "mithril-darts", label: "Mithril darts", level: 52, xp: 112, actionsPerHour: DART_APH, inputs: [{ name: "Mithril dart tip", qty: 10 }, { name: "Feather", qty: 10 }], output: { name: "Mithril dart", qty: 10 } },
  { id: "adamant-darts", label: "Adamant darts", level: 67, xp: 150, actionsPerHour: DART_APH, inputs: [{ name: "Adamant dart tip", qty: 10 }, { name: "Feather", qty: 10 }], output: { name: "Adamant dart", qty: 10 } },
  { id: "rune-darts", label: "Rune darts", level: 81, xp: 188, actionsPerHour: DART_APH, inputs: [{ name: "Rune dart tip", qty: 10 }, { name: "Feather", qty: 10 }], output: { name: "Rune dart", qty: 10 } },
  { id: "amethyst-darts", label: "Amethyst darts", level: 90, xp: 210, actionsPerHour: DART_APH, inputs: [{ name: "Amethyst dart tip", qty: 10 }, { name: "Feather", qty: 10 }], output: { name: "Amethyst dart", qty: 10 } },
  { id: "dragon-darts", label: "Dragon darts", level: 95, xp: 250, actionsPerHour: DART_DRAGON_APH, inputs: [{ name: "Dragon dart tip", qty: 10 }, { name: "Feather", qty: 10 }], output: { name: "Dragon dart", qty: 10 } },
  { id: "bronze-bolts", label: "Bronze bolts", level: 9, xp: 5, actionsPerHour: BOLT_APH, inputs: [{ name: "Bronze bolts (unf)", qty: 10 }, { name: "Feather", qty: 10 }], output: { name: "Bronze bolts", qty: 10 } },
  { id: "iron-bolts", label: "Iron bolts", level: 39, xp: 15, actionsPerHour: BOLT_APH, inputs: [{ name: "Iron bolts (unf)", qty: 10 }, { name: "Feather", qty: 10 }], output: { name: "Iron bolts", qty: 10 } },
  { id: "steel-bolts", label: "Steel bolts", level: 46, xp: 35, actionsPerHour: BOLT_APH, inputs: [{ name: "Steel bolts (unf)", qty: 10 }, { name: "Feather", qty: 10 }], output: { name: "Steel bolts", qty: 10 } },
  { id: "mithril-bolts", label: "Mithril bolts", level: 54, xp: 50, actionsPerHour: BOLT_APH, inputs: [{ name: "Mithril bolts (unf)", qty: 10 }, { name: "Feather", qty: 10 }], output: { name: "Mithril bolts", qty: 10 } },
  { id: "broad-bolts", label: "Broad bolts", level: 55, xp: 30, actionsPerHour: BROAD_BOLT_APH, inputs: [{ name: "Unfinished broad bolts", qty: 10 }, { name: "Feather", qty: 10 }], output: { name: "Broad bolts", qty: 10 } },
  { id: "adamant-bolts", label: "Adamant bolts", level: 61, xp: 70, actionsPerHour: BOLT_APH, inputs: [{ name: "Adamant bolts (unf)", qty: 10 }, { name: "Feather", qty: 10 }], output: { name: "Adamant bolts", qty: 10 } },
  { id: "rune-bolts", label: "Rune bolts", level: 69, xp: 100, actionsPerHour: BOLT_APH, inputs: [{ name: "Runite bolts (unf)", qty: 10 }, { name: "Feather", qty: 10 }], output: { name: "Runite bolts", qty: 10 } },
  { id: "dragon-bolts", label: "Dragon bolts", level: 84, xp: 120, actionsPerHour: BOLT_APH, inputs: [{ name: "Dragon bolts (unf)", qty: 10 }, { name: "Feather", qty: 10 }], output: { name: "Dragon bolts", qty: 10 } },
  { id: "opal-bolt-tips", label: "Opal bolt tips", level: 11, xp: 1.5, actionsPerHour: GEM_TIP_APH, inputs: [{ name: "Opal", qty: 1 }], output: { name: "Opal bolt tips", qty: 12 } },
  { id: "jade-bolt-tips", label: "Jade bolt tips", level: 26, xp: 2, actionsPerHour: GEM_TIP_APH, inputs: [{ name: "Jade", qty: 1 }], output: { name: "Jade bolt tips", qty: 12 } },
  { id: "topaz-bolt-tips", label: "Red topaz bolt tips", level: 48, xp: 3.9, actionsPerHour: GEM_TIP_APH, inputs: [{ name: "Red topaz", qty: 1 }], output: { name: "Topaz bolt tips", qty: 12 } },
  { id: "sapphire-bolt-tips", label: "Sapphire bolt tips", level: 56, xp: 4, actionsPerHour: GEM_TIP_APH, inputs: [{ name: "Sapphire", qty: 1 }], output: { name: "Sapphire bolt tips", qty: 12 } },
  { id: "emerald-bolt-tips", label: "Emerald bolt tips", level: 58, xp: 5.5, actionsPerHour: GEM_TIP_APH, inputs: [{ name: "Emerald", qty: 1 }], output: { name: "Emerald bolt tips", qty: 12 } },
  { id: "ruby-bolt-tips", label: "Ruby bolt tips", level: 63, xp: 6.3, actionsPerHour: GEM_TIP_APH, inputs: [{ name: "Ruby", qty: 1 }], output: { name: "Ruby bolt tips", qty: 12 } },
  { id: "diamond-bolt-tips", label: "Diamond bolt tips", level: 65, xp: 7, actionsPerHour: GEM_TIP_APH, inputs: [{ name: "Diamond", qty: 1 }], output: { name: "Diamond bolt tips", qty: 12 } },
  { id: "dragonstone-bolt-tips", label: "Dragonstone bolt tips", level: 71, xp: 8.2, actionsPerHour: GEM_TIP_APH, inputs: [{ name: "Dragonstone", qty: 1 }], output: { name: "Dragonstone bolt tips", qty: 12 } },
  { id: "onyx-bolt-tips", label: "Onyx bolt tips", level: 73, xp: 9.4, actionsPerHour: GEM_TIP_APH, inputs: [{ name: "Onyx", qty: 1 }], output: { name: "Onyx bolt tips", qty: 12 } },
  { id: "diamond-bolts", label: "Diamond bolts", level: 65, xp: 70, actionsPerHour: TIPPING_APH, inputs: [{ name: "Adamant bolts", qty: 10 }, { name: "Diamond bolt tips", qty: 10 }], output: { name: "Diamond bolts", qty: 10 } },
  { id: "ruby-bolts", label: "Ruby bolts", level: 63, xp: 63, actionsPerHour: TIPPING_APH, inputs: [{ name: "Adamant bolts", qty: 10 }, { name: "Ruby bolt tips", qty: 10 }], output: { name: "Ruby bolts", qty: 10 } },
  { id: "diamond-dragon-bolts", label: "Diamond dragon bolts", level: 84, xp: 70, actionsPerHour: TIPPING_APH, inputs: [{ name: "Dragon bolts", qty: 10 }, { name: "Diamond bolt tips", qty: 10 }], output: { name: "Diamond dragon bolts", qty: 10 } },
  { id: "ruby-dragon-bolts", label: "Ruby dragon bolts", level: 84, xp: 63, actionsPerHour: TIPPING_APH, inputs: [{ name: "Dragon bolts", qty: 10 }, { name: "Ruby bolt tips", qty: 10 }], output: { name: "Ruby dragon bolts", qty: 10 } },
  { id: "onyx-dragon-bolts", label: "Onyx dragon bolts", level: 87, xp: 94, actionsPerHour: TIPPING_APH, inputs: [{ name: "Dragon bolts", qty: 10 }, { name: "Onyx bolt tips", qty: 10 }], output: { name: "Onyx dragon bolts", qty: 10 } },
  { id: "headless-arrows", label: "Headless arrows", level: 1, xp: 15, actionsPerHour: ARROW_APH, inputs: [{ name: "Arrow shaft", qty: 15 }, { name: "Feather", qty: 15 }], output: { name: "Headless arrow", qty: 15 } },
  { id: "bronze-arrows", label: "Bronze arrows", level: 1, xp: 19.5, actionsPerHour: ARROW_APH, inputs: [{ name: "Headless arrow", qty: 15 }, { name: "Bronze arrowtips", qty: 15 }], output: { name: "Bronze arrow", qty: 15 } },
  { id: "iron-arrows", label: "Iron arrows", level: 15, xp: 37.5, actionsPerHour: ARROW_APH, inputs: [{ name: "Headless arrow", qty: 15 }, { name: "Iron arrowtips", qty: 15 }], output: { name: "Iron arrow", qty: 15 } },
  { id: "steel-arrows", label: "Steel arrows", level: 30, xp: 75, actionsPerHour: ARROW_APH, inputs: [{ name: "Headless arrow", qty: 15 }, { name: "Steel arrowtips", qty: 15 }], output: { name: "Steel arrow", qty: 15 } },
  { id: "mithril-arrows", label: "Mithril arrows", level: 45, xp: 112.5, actionsPerHour: ARROW_APH, inputs: [{ name: "Headless arrow", qty: 15 }, { name: "Mithril arrowtips", qty: 15 }], output: { name: "Mithril arrow", qty: 15 } },
  { id: "broad-arrows", label: "Broad arrows", level: 52, xp: 150, actionsPerHour: BROAD_ARROW_APH, inputs: [{ name: "Broad arrowheads", qty: 15 }, { name: "Headless arrow", qty: 15 }], output: { name: "Broad arrows", qty: 15 } },
  { id: "adamant-arrows", label: "Adamant arrows", level: 60, xp: 150, actionsPerHour: ARROW_APH, inputs: [{ name: "Headless arrow", qty: 15 }, { name: "Adamant arrowtips", qty: 15 }], output: { name: "Adamant arrow", qty: 15 } },
  { id: "rune-arrows", label: "Rune arrows", level: 75, xp: 187.5, actionsPerHour: ARROW_APH, inputs: [{ name: "Headless arrow", qty: 15 }, { name: "Rune arrowtips", qty: 15 }], output: { name: "Rune arrow", qty: 15 } },
  { id: "amethyst-arrows", label: "Amethyst arrows", level: 82, xp: 159, actionsPerHour: BROAD_ARROW_APH, inputs: [{ name: "Amethyst arrowtips", qty: 15 }, { name: "Headless arrow", qty: 15 }], output: { name: "Amethyst arrow", qty: 15 } },
  { id: "dragon-arrows", label: "Dragon arrows", level: 90, xp: 225, actionsPerHour: ARROW_APH, inputs: [{ name: "Headless arrow", qty: 15 }, { name: "Dragon arrowtips", qty: 15 }], output: { name: "Dragon arrow", qty: 15 } },
];

export function fletchingMethodItemNames(): string[] {
  const names = new Set<string>();
  for (const m of FLETCHING_METHODS) {
    for (const p of m.inputs) names.add(p.name);
    names.add(m.output.name);
  }
  return [...names];
}
