/** Map method id/label → filter chip category. */
export function getActivityType(
  skillKey: string,
  m: { id: string; label: string },
  isActivity = false,
): string {
  const id = m.id.toLowerCase();
  const label = m.label.toLowerCase();

  if (id.includes("infernal-shale") || label.includes("infernal shale")) return "Infernal shale";

  if (isActivity) {
    if (id.includes("wintertodt")) return "Wintertodt";
    if (id.includes("tempoross")) return "Tempoross";
    if (id.includes("gotr") || id.includes("guardians")) return "GOTR";
    if (id.includes("foundry")) return "Giants' Foundry";
    if (id.includes("mahogany")) return "Mahogany Homes";
    if (id.includes("motherlode")) return "Motherlode Mine";
    if (id.includes("volcanic")) return "Volcanic Mine";
    if (id.includes("blast-mine")) return "Blast Mine";
    if (id.includes("shooting")) return "Shooting Stars";
    if (id.includes("pyramid")) return "Pyramid Plunder";
    if (id.includes("artefacts")) return "Stealing artefacts";
    if (id.includes("mta")) return "MTA";
    if (id.includes("herbiboar")) return "Herbiboar";
    return "Minigames";
  }

  switch (skillKey) {
    case "crafting":
      if (id.includes("battlestaff") || label.includes("battlestaff")) return "Battlestaves";
      if (id.includes("dhide") || label.includes("d'hide") || label.includes("dragon leather"))
        return "D'hide";
      if (id.includes("golem")) return "Golem crafting";
      if (id.startsWith("cut-") || label.startsWith("cut ")) return "Gem cutting";
      if (
        id.includes("glass") ||
        id.includes("orb") ||
        id.includes("vial") ||
        label.includes("glass") ||
        label.includes("orb")
      )
        return "Glassblowing";
      if (id.includes("amethyst")) return "Amethyst";
      return "Jewellery";

    case "fletching":
      if (id.includes("bow") || label.includes("bow")) return "Bows";
      if (id.includes("dart")) return "Darts";
      if (id.includes("bolt") && !id.includes("tip") && !label.includes("tip")) return "Bolts";
      if (id.includes("tip") || label.includes("bolt tips")) return "Bolt tips";
      if (id.includes("arrow") || label.includes("arrow")) return "Arrows";
      return "Other";

    case "herblore":
      if (id.startsWith("clean-")) return "Herb cleaning";
      if (id.startsWith("degrime-")) return "Degrime";
      return "Potions";

    case "smithing":
      if (id.startsWith("bf-")) return "Blast Furnace";
      if (id.includes("dart-tip")) return "Dart tips";
      if (id.includes("nails")) return "Nails";
      if (id.includes("cannon")) return "Cannonballs";
      if (
        id.includes("plate") ||
        id.includes("2h") ||
        id.includes("legs") ||
        id.includes("skirt") ||
        id.includes("shield") ||
        id.includes("axe") ||
        id.includes("warhammer")
      )
        return "Armour & weapons";
      return "Other";

    case "prayer":
      if (id.includes("ensouled")) return "Ensouled heads";
      if (id.includes("ashes") || id.includes("demonic")) return "Demonic offering";
      if (id.includes("shards")) return "Bone shards";
      return "Bones";

    case "cooking":
      if (id.includes("wine")) return "Wine";
      if (id.includes("karambwan")) return "Karambwan";
      return "Fish";

    case "mining":
      if (id.includes("granite") || label.includes("granite")) return "Granite";
      if (id.includes("sandstone") || label.includes("sandstone")) return "Sandstone";
      return "Ores";

    case "fishing":
      if (id.includes("karambwan")) return "Karambwan";
      if (id.includes("minnow") || label.includes("minnow")) return "Minnows";
      if (id.includes("angler") || label.includes("angler")) return "Anglerfish";
      return "Fish";

    case "woodcutting":
      if (id.includes("teak") || label.includes("teak")) return "Teaks";
      if (id.includes("redwood") || label.includes("redwood")) return "Redwoods";
      if (id.includes("sulliuscep") || label.includes("sulliuscep")) return "Sulliusceps";
      return "Logs";

    case "firemaking":
      if (id.includes("wintertodt")) return "Wintertodt";
      return "Logs";

    case "runecraft":
      if (id.includes("blood") || label.includes("blood")) return "Bloods";
      if (id.includes("soul") || label.includes("soul")) return "Souls";
      if (id.includes("zmi") || label.includes("ourania") || label.includes("zmi")) return "ZMI";
      return "Runes";

    case "agility":
      if (id.includes("rooftop") || label.includes("rooftop")) return "Rooftops";
      if (id.includes("sepulchre") || label.includes("sepulchre")) return "Hallowed Sepulchre";
      if (id.includes("brimhaven") || label.includes("brimhaven")) return "Brimhaven";
      return "Courses";

    case "thieving":
      if (id.includes("blackjack") || label.includes("blackjack")) return "Blackjacking";
      if (id.includes("pickpocket") || label.includes("pickpocket") || label.includes("knight"))
        return "Pickpocketing";
      if (id.includes("stall") || label.includes("stall")) return "Stalls";
      return "Other";

    case "hunter":
      if (id.includes("chinchompa") || label.includes("chin")) return "Chinchompas";
      if (id.includes("herbiboar")) return "Herbiboar";
      if (id.includes("bird") || label.includes("bird")) return "Bird houses";
      if (id.includes("crab") || label.includes("crab")) return "Crab trapping";
      if (id.includes("kebbit") || label.includes("falconry")) return "Falconry";
      return "Creatures";

    case "farming":
      if (id.includes("tree") || label.includes("tree")) return "Trees";
      if (id.includes("herb") || label.includes("herb")) return "Herbs";
      if (id.includes("fruit") || label.includes("fruit")) return "Fruit trees";
      if (id.includes("allot") || label.includes("allot")) return "Allotments";
      return "Patches";

    case "construction":
      if (id.includes("mahogany") || label.includes("mahogany")) return "Mahogany Homes";
      if (id.includes("table") || label.includes("table")) return "Tables";
      if (id.includes("bench") || label.includes("bench")) return "Benches";
      return "Furniture";

    case "magic":
      if (id.includes("alch") || label.includes("alch")) return "High Alchemy";
      if (
        id.includes("burst") ||
        id.includes("barrage") ||
        label.includes("burst") ||
        label.includes("barrage")
      )
        return "Burst / Barrage";
      if (id.includes("mta") || label.includes("mta")) return "MTA";
      return "Spells";

    default:
      return "Methods";
  }
}
