import { SkillingMethodsPanel } from "@/components/SkillingMethodsPanel";
import { CRAFTING_METHODS } from "@/lib/crafting-methods";
import type { PriceRow, Trend } from "@/lib/osrs.server";
import type { PlayerSkills } from "@/lib/player-stats";

export function CraftingMethodsPanel({
  rowsByName,
  trendsById,
  moneyPerHour,
  onMoneyPerHourChange,
  playerSkills,
}: {
  rowsByName: Map<string, PriceRow>;
  trendsById?: Record<number, Trend> | undefined;
  moneyPerHour: number;
  onMoneyPerHourChange: (n: number) => void;
  playerSkills?: PlayerSkills | null | undefined;
}) {
  return (
    <SkillingMethodsPanel
      title="Crafting methods"
      skillKey="crafting"
      skillLabel="Crafting"
      description="Glass, jewellery, battlestaves, d'hide, amethyst and Golem Crafting (Wyrmscraig). Sorted by what each XP costs you."
      methods={CRAFTING_METHODS}
      rowsByName={rowsByName}
      trendsById={trendsById}
      moneyPerHour={moneyPerHour}
      onMoneyPerHourChange={onMoneyPerHourChange}
      playerSkills={playerSkills}
    />
  );
}
