import { SkillingMethodsPanel } from "@/components/SkillingMethodsPanel";
import { SMITHING_METHODS } from "@/lib/smithing-methods";
import { activitiesForSkill } from "@/lib/activity-methods";
import type { PriceRow, Trend } from "@/lib/osrs.server";
import type { PlayerSkills } from "@/lib/player-stats";

export function SmithingMethodsPanel({
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
      title="Smithing methods"
      skillKey="smithing"
      skillLabel="Smithing"
      description="Blast Furnace, anvil, cannonballs, and Giants' Foundry. BF coal is already halved. Sorted by what each XP costs you."
      methods={SMITHING_METHODS}
      activities={activitiesForSkill("smithing")}
      rowsByName={rowsByName}
      trendsById={trendsById}
      moneyPerHour={moneyPerHour}
      onMoneyPerHourChange={onMoneyPerHourChange}
      playerSkills={playerSkills}
    />
  );
}
