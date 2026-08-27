/**
 * Fletching training methods (P2P).
 * Stringing longbows: Money making guide lists 2,400/h.
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
const BOW_STRING_APH = 2400; // MMG stringing yew/magic longbows

export const FLETCHING_METHODS: FletchingMethod[] = [
  {
    id: "maple-longbow-u",
    label: "Maple longbow (u)",
    level: 55,
    xp: 58.3,
    actionsPerHour: BOW_U_APH,
    inputs: [{ name: "Maple logs", qty: 1 }],
    output: { name: "Maple longbow (u)", qty: 1 },
  },
  {
    id: "maple-longbow",
    label: "String maple longbow",
    level: 55,
    xp: 58.3,
    actionsPerHour: BOW_STRING_APH,
    inputs: [
      { name: "Maple longbow (u)", qty: 1 },
      { name: "Bow string", qty: 1 },
    ],
    output: { name: "Maple longbow", qty: 1 },
  },
  {
    id: "yew-longbow-u",
    label: "Yew longbow (u)",
    level: 70,
    xp: 75,
    actionsPerHour: BOW_U_APH,
    inputs: [{ name: "Yew logs", qty: 1 }],
    output: { name: "Yew longbow (u)", qty: 1 },
  },
  {
    id: "yew-longbow",
    label: "String yew longbow",
    level: 70,
    xp: 75,
    actionsPerHour: BOW_STRING_APH,
    inputs: [
      { name: "Yew longbow (u)", qty: 1 },
      { name: "Bow string", qty: 1 },
    ],
    output: { name: "Yew longbow", qty: 1 },
  },
  {
    id: "magic-longbow-u",
    label: "Magic longbow (u)",
    level: 85,
    xp: 91.5,
    actionsPerHour: BOW_U_APH,
    inputs: [{ name: "Magic logs", qty: 1 }],
    output: { name: "Magic longbow (u)", qty: 1 },
  },
  {
    id: "magic-longbow",
    label: "String magic longbow",
    level: 85,
    xp: 91.5,
    actionsPerHour: BOW_STRING_APH,
    inputs: [
      { name: "Magic longbow (u)", qty: 1 },
      { name: "Bow string", qty: 1 },
    ],
    output: { name: "Magic longbow", qty: 1 },
  },
];
